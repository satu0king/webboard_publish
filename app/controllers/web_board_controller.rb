require 'json'

class WebBoardController < ApplicationController
  layout :false, :except => :new_create
  def write
    @lecture = Lecture.find(params[:id]).data
    @lecturee = Lecture.find(params[:id])
    @course = @lecturee.course
    @course_holder = @course.user
    @pdf = @lecturee.pdf_url
  end

  def view
    @lecture = Lecture.find(params[:id]).data
    @lecturee = Lecture.find(params[:id])
    @pdf = @lecturee.pdf_url
  end

  def new
    @hang = true
    render 'write'   
  end

  def savehang
    @lecture = Lecture.new
    @lecture.course_id = Course.first.id
    @lecture.name = "dummy"
    @lecture.data = params[:data]
    @lecture.card = params[:image]
    @lecture.save
    puts @lecture.errors.full_messages
    redirect_to save_board_path
  end

  def new_create
    @courses = current_user.courses
    @lecture = Lecture.first
    render 'add'
  end

  def create
    @lecture = Lecture.first
    course_id = 0
    if(!lecture_params[:course_id].empty?)
      @lecture.course_id = lecture_params[:course_id]
      course_id = lecture_params[:course_id]
    else
      @course = Course.new(:user_id => current_user.id, :name => lecture_params[:course_name])
      @course.save
      course_id = @course.id
      puts @course.errors.full_messages
      @lecture.course_id = @course.id
    end
    puts lecture_params[:course_id]
    @lecture.name = lecture_params[:name]
    if @lecture.save
      flash[:success] = "lecture created"
      redirect_to(course_lectures_path(course_id, @lecture))
    else
      print "==========================\n"
      print @lecture.errors.full_messages
      print "\n===================================="
      flash[:danger] = "lecture failed to save"
      redirect_to '/save_as'
    end
  end

  def save_image
    @lecture = Lecture.find(params[:id])
    @lecture.card = params[:image]
    @z = @lecture.course
    @x=current_user
    @y = @z.user
    if( user_signed_in? and current_user == @z.user)
      @lecture.save
    end
  end

  def save
    @lecture = Lecture.find(params[:id])
    data = params[:data]
    @lecture.data = data
    @lecture.card = params[:image]
    @z = @lecture.course
    @x=current_user
    @y = @z.user
    if( user_signed_in? and current_user == @z.user)
      @lecture.save
    end
  end

  def pdf_upload
    @lecture = Lecture.find(params[:id])
    pdf = params[:pdf]
    @lecture.pdf = pdf
    @z = @lecture.course
    @x=current_user
    @y = @z.user
    if(user_signed_in? and current_user == @z.user)
      @lecture.save
    end
  end

  def page_save
    @lecture = Lecture.find(params[:id])
    data = @lecture.data
    if(data != nil)
      data_json = JSON.parse(@lecture.data)
      if(data_json["pages"][params[:page_id].to_i] == nil)
        data_json["pages"].push(JSON.parse(params[:data])["pages"][0])
        puts data_json
      else
        data_json["pages"][params[:page_id].to_i] = JSON.parse(params[:data])["pages"][0]
      end
      data = data_json.to_json
    else
      data = params[:data]
      # puts
      # puts data.to_json
    end
    @lecture.data = data
    if params[:page_id].to_i == 0
      @lecture.card = params[:image]
    end
    @lecture.save
    puts @lecture.errors.full_messages
  end

  private
    def lecture_params
      params.require(:lecture).permit(:course_id, :course_name, :name)
    end
end
