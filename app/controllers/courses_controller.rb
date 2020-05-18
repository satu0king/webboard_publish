class CoursesController < ApplicationController
  before_action :set_course, only: [:show, :edit, :update, :destroy]
  # GET /courses
  # GET /courses.json
  def index
    @listings = Course.all
    # @list = structHelperGet.paginate :page => params[:page], :per_page => 1
    @x = params[:search]
    @y = 0
    if(@x == nil)
      @y = 1
    end
    @list = []
    @flag=0
    @listings.each do |ll|
      if(ll.name == @x)
          @list.push(ll)
          @flag = 1
      end
    end
  end


  # GET /courses/1
  # GET /courses/1.json
  def show
  end

  # GET /courses/new
  def new
    @course = Course.new
  end

  # GET /courses/1/edit
  def edit
  end

  # POST /courses
  # POST /courses.json
  def create
    @course = Course.new(course_params)
    @course.user_id = current_user.id
    @course.up_count = 0
    @course.down_count = 0
    respond_to do |format|
      if @course.save
        format.html { redirect_to user_course_path(@course.user), notice: 'Course was successfully created.' }
        format.json { render :show, status: :created, location: @course }
      else
        format.html { render :new }
        format.json { render json: @course.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /courses/1
  # PATCH/PUT /courses/1.jsonhttps://circuitverse.org/users/43
  def update
    respond_to do |format|
      if @course.update(course_params)
        format.html { redirect_to @course, notice: 'Course was successfully updated.' }
        format.json { render :show, status: :ok, location: @course }
      else
        format.html { render :edit }
        format.json { render json: @course.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /courses/1
  # DELETE /courses/1.json
  def destroy
    @course.destroy
    redirect_to user_course_path(current_user)
    flash[:success] = "Deleted Course"
    # respond_to do |format|
    #   format.html { redirect_to courses_url, notice: 'Course was successfully destroyed.' }
    #   format.json { head :no_content }
  # end
  end

  def increment
    @course = Course.find(vote_params)
    @vote = Vote.find_by(user_id: current_user.id, course_id: vote_params)
    if(@vote == nil)
      @new_vote = Vote.new(user_id: current_user.id, course_id: vote_params)
      @course.up_count += 1
      @new_vote.save
    end
    @course.save
    redirect_to index_path
  end

  def decrement
    @course = Course.find(vote_params)
    @vote = Vote.find_by(user_id: current_user.id, course_id: vote_params)
    if(@vote == nil)
      @new_vote = Vote.new(user_id: current_user.id, course_id: vote_params)
      @course.up_count += 1
      @new_vote.save
    end
    @course.save
    redirect_to index_path
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_course
      @course = Course.find(params[:id])
    end
    
    # Never trust parameters from the scary internet, only allow the white list through.
    def course_params
      params.require(:course).permit(:user_id, :name, :description)
    end

    def coupon_params
      params.require(:coupon).permit(:store, :coupon_code)
    end

    def vote_params
      return params.require("course_id")
    end

end
