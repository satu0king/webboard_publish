class FollowController < ApplicationController
  def all
    @following = Follow.where(:user_id => current_user.id)
  end

  def new
    if !user_signed_in? 
      flash[:danger] = "You need to login"
      redirect_to new_user_session_path
      return
    end
    if Follow.where(user_id: current_user.id, course_id: follow_params).exists?
      flash[:danger] = "You already follow this course"
    else
      @follow = Follow.new(user_id: current_user.id, course_id: follow_params)
      if @follow.save
        flash[:success] = "You are now following this course"
      else
        puts @follow.errors.full_messages
        flash[:danger] = "Course couldn't be followed"
      end
    end
    redirect_to index_path
  end

  def destroy
    @remove_from_follow_list = Follow.find_by(user_id: current_user.id, course_id: unfollow_params)
    @remove_from_follow_list.delete
    redirect_to user_follow_path(current_user)
    flash[:success] = "You unfollowed the course"
  end

  private
  def follow_params
    return params.require("course_id")
  end

  def unfollow_params
    return params.require("course_id")
  end
end
