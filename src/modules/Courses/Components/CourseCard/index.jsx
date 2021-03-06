import { Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  deleteCourse,
  enrollCourse,
  unenrollCourse,
} from '../../../../store/actions/courses';
import Classes from './index.module.css';

const CourseCard = ({ id, title, syllabus, instructor }) => {
  const navigate = useNavigate();
  const goToCourse = () => {
    navigate('/courses/' + id);
  };

  const userId = useSelector((state) => state.me.id);
  const admin = useSelector((state) => state.auth.admin);
  const enrolledCourses = useSelector((state) => state.me.enrolledCourses);
  const deletingCourseId = useSelector((state) => state.courses.removingCourse);
  const enrollingCourseId = useSelector(
    (state) => state.courses.enrollingCourse,
  );
  const unenrollingCourseId = useSelector(
    (state) => state.courses.unenrollingCourse,
  );

  const [searchParams] = useSearchParams();
  const page = +searchParams.get('page') || 1;
  const dispatch = useDispatch();
  const deleteHandler = () => {
    dispatch(deleteCourse(id, page));
  };

  const enrollHandler = () => {
    dispatch(enrollCourse(id));
  };

  const unenrollHandler = () => {
    dispatch(unenrollCourse(id));
  };

  const userEnrolledInCourse = enrolledCourses.reduce(
    (prev, course) => prev || course.id === id,
    false,
  );

  const userIsInCourse = instructor === userId || userEnrolledInCourse;

  return (
    <Card style={{ width: '18rem', margin: '20px' }}>
      <Card.Body>
        <Card.Title className={Classes.title}>{title}</Card.Title>
        <Card.Text className={Classes.title}>{syllabus}</Card.Text>
        <div className={Classes.btns}>
          {userIsInCourse || admin ? (
            <Button onClick={goToCourse} variant="primary">
              View Course
            </Button>
          ) : null}

          {!userIsInCourse ? (
            <Button
              disabled={enrollingCourseId === id}
              onClick={enrollHandler}
              variant="success"
            >
              {enrollingCourseId === id ? (
                <Spinner animation="border" size="sm" role="status">
                  <span className="visually-hidden">Enrolling...</span>
                </Spinner>
              ) : (
                'Enroll Now!'
              )}
            </Button>
          ) : null}

          {userEnrolledInCourse ? (
            <Button
              disabled={unenrollingCourseId === id}
              onClick={unenrollHandler}
              variant="danger"
            >
              {unenrollingCourseId === id ? (
                <Spinner animation="border" size="sm" role="status">
                  <span className="visually-hidden">UnEnrolling...</span>
                </Spinner>
              ) : (
                'Unenroll'
              )}
            </Button>
          ) : null}

          {instructor === userId ? (
            <Button
              disabled={deletingCourseId === id}
              onClick={deleteHandler}
              variant="danger"
            >
              {deletingCourseId === id ? (
                <Spinner animation="border" size="sm" role="status">
                  <span className="visually-hidden">Removing...</span>
                </Spinner>
              ) : (
                'Delete Course'
              )}
            </Button>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
