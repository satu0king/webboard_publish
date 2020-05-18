class LecturesController < ApplicationController
  before_action :set_lecture, only: [:show, :edit, :update, :destroy]
  # GET /lectures
  # GET /lectures.json
  def index
    @lectures = Lecture.where(:course_id => params[:course_id])
    @course = Course.find(params[:course_id])
    @template = []
    @lectures.each do |i|
      @template.push(i.card)
    end
  end

  # GET /lectures/1
  # GET /lectures/1.json

  def view
  end 

  def show
  end

  # GET /lectures/new
  def new
    @lecture = Lecture.new
    @course = Course.find(params[:course_id])
  end

  # GET /lectures/1/edit
  def edit
    @course = Course.find(params[:course_id])
  end

  # POST /lectures
  # POST /lectures.json
  def create
    @lecture = Lecture.new(lecture_params)
    @lecture.course_id = params[:course_id]
    respond_to do |format|
      if @lecture.save
        format.html { redirect_to course_lectures_url, notice: 'Lecture was successfully created.' }
        format.json { render :show, status: :created, location: @lecture }
      else
        format.html { render :new }
        format.json { render json: @lecture.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /lectures/1
  # PATCH/PUT /lectures/1.json
  def update
    respond_to do |format|
      if @lecture.update(lecture_params)
        format.html { redirect_to course_lectures_url, notice: 'Lecture was successfully updated.' }
        format.json { render :show, status: :ok, location: @lecture }
      else
        format.html { render :edit }
        format.json { render json: @lecture.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /lectures/1
  # DELETE /lectures/1.json
  def destroy
    @lecture.destroy
    respond_to do |format|
      format.html { redirect_to course_lectures_url, notice: 'Lecture was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def search
    
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_lecture
      @lecture = Lecture.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def lecture_params
      params.require(:lecture).permit(:course_id, :name, :pdf)
    end
end
