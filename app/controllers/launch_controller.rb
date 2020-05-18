
# Used to validate oauth signatures
#require 'oauth/request_proxy/action_controller_request'
require 'ims/lti'
class LaunchController < ApplicationController
  # layout :false
  def launch
    provider = IMS::LTI::ToolProvider.new(
      Rails.application.config.lti_settings['consumer_key'],
      Rails.application.config.lti_settings['consumer_secret'],
      request.query_parameters
    )

    if not provider.valid_request?(request)
      # the request wasnt validated :(
      render :launch_error, status: 401
      return
    end

    # The providre request is valid
    # store the values you need from the LTI
    # here we're just tossing them into the session
    session[:user_id] = params.require :user_id
    session[:lis_person_name_full] = params.require :lis_person_name_full

    # set variables for use by the template
    @lis_person_name_full = session[:lis_person_name_full]
    @course_name = params[:context_title]
    @course = Course.find_by_name(params[:context_title]).id
  end

  # lTI XML Configuration
  # Used for easily installing your LTI into an LMS
  def lti_config
    render template: "launch/lti_config.xml"
  end
end
