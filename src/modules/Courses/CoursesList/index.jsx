import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';

import Classes from './index.module.css';
import Loading from '../../../Core/Loading';
import CourseCard from '../Components/CourseCard';
import { getCourses } from '../../../store/actions/courses';

const CoursesList = () => {
  const { loading, error, courses, pages } = useSelector(
    (state) => state.courses,
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const changePage = useCallback(
    (newPage) => {
      window.scrollTo(0, 0, 'smooth');
      setSearchParams({ page: newPage });
    },
    [setSearchParams],
  );

  const page = +searchParams.get('page') || 1;

  const pagesArray = [
    <Pagination.Prev
      key="prev"
      onClick={() => changePage(page - 1)}
      disabled={page === 1}
    />,
  ];
  for (let i = 1; i <= pages; i++) {
    pagesArray.push(
      <Pagination.Item
        key={i}
        active={i === page}
        onClick={() => changePage(i)}
      >
        {i}
      </Pagination.Item>,
    );
  }

  pagesArray.push(
    <Pagination.Next
      key="next"
      onClick={() => changePage(page + 1)}
      disabled={page === pages}
    />,
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCourses(page));
  }, [dispatch, page]);

  return loading ? (
    <Loading />
  ) : (
    <div className={Classes.container}>
      {error ? (
        <p className={Classes.error}>Couldn't fetch courses!</p>
      ) : (
        <div>
          <div className={Classes.ownedCourses}>
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                syllabus={course.syllabus}
                instructor={course.instructor}
              />
            ))}
          </div>

          {pages > 1 ? (
            <div className={Classes.pagination}>
              <Pagination>{pagesArray}</Pagination>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CoursesList;
