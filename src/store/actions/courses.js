import { toast } from 'react-toastify';

import api from '../../api';
import * as actionTypes from '../action_types/courses';
import { REMOVE_OWNED_COURSE, ADD_ENROLLED_COURSE } from '../action_types/me';

export const getCourses = (page) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.FETCH_COURSES_START });

    try {
      const response = await api.get(
        `/courses?page=${page}&limit=12&sort=-createdAt`,
      );

      dispatch({
        type: actionTypes.FETCH_COURSES_SUCCESS,
        payload: response,
      });
    } catch {
      dispatch({ type: actionTypes.FETCH_COURSES_FAIL });

      toast.error("Couldn't fetch courses!");
    }
  };
};

export const deleteCourse = (id) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.DELETE_COURSE_START, payload: id });

    try {
      await api.delete('/courses/' + id);

      dispatch({ type: REMOVE_OWNED_COURSE, payload: id });
      toast.success('Course deleted!');
    } catch {
      toast.error("Couldn't delete course!");
    } finally {
      dispatch({ type: actionTypes.DELETE_COURSE_DONE });
    }
  };
};

export const enrollCourse = (id) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.ENROLL_COURSE_START, payload: id });

    try {
      await api.post(`courses/${id}/enroll`);

      dispatch({ type: ADD_ENROLLED_COURSE, payload: id });
      toast.success('Enrolled in course!');
    } catch {
      toast.error("Couldn't enroll in course!");
    } finally {
      dispatch({ type: actionTypes.ENROLL_COURSE_DONE });
    }
  };
};

export const fetchCurrentCourse = (id) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.FETCH_CURRENT_COURSE_START });

    try {
      const response = await api.get('courses/' + id);

      dispatch({
        type: actionTypes.FETCH_CURRENT_COURSE_SUCCESS,
        payload: response.data,
      });
    } catch {
      toast.error("Couldn't fetch course!");
      dispatch({ type: actionTypes.FETCH_CURRENT_COURSE_FAIL });
    }
  };
};
