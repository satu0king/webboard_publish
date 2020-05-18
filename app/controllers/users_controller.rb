class UsersController < ApplicationController
  before_action :authenticate_user!
  def profile
    begin
      @user = User.find(params[:id])
      if @user != current_user
        flash[:danger] = "Not Accessible"
        redirect_to('/users/'+current_user.id.to_s+'/profile')
      end
    rescue ActiveRecord::RecordNotFound
      flash[:danger] = "Not Accessibe"
      redirect_to('/')
    end
  end

  def course
    begin
      @user = User.find(params[:id])
      if @user != current_user
        flash[:danger] = "Not Accessible"
        redirect_to('/users/'+current_user.id.to_s+'/profile')
      end
      all_courses = []
      if @user.courses.any?
        @user.courses.each do |i|
          all_courses.push(i.name)
        end
      else
        all_courses.push("No courses")
      end
      @course = all_courses
    rescue ActiveRecord::RecordNotFound
      flash[:danger] = "Not accessible"
      redirect_to('/')
    end
  end
end
