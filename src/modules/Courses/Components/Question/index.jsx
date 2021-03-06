import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Spinner } from 'react-bootstrap';

import Classes from './index.module.css';
import RepliesSection from '../RepliesSection';
import { deleteQuestion } from '../../../../store/actions/comments';

const Question = ({
  authorId,
  courseId,
  questionId,
  authorName,
  title,
  description,
  createdAt,
  replies,
  userIsInCourse,
  page,
}) => {
  const userId = useSelector((state) => state.me.id);
  const deletingQuestion = useSelector(
    (state) => state.comments.deletingQuestion,
  );

  const dateCreated = new Date(createdAt);
  const formattedDate =
    ('00' + (dateCreated.getMonth() + 1)).slice(-2) +
    '/' +
    ('00' + dateCreated.getDate()).slice(-2) +
    '/' +
    dateCreated.getFullYear() +
    ', ' +
    ('00' + dateCreated.getHours()).slice(-2) +
    ':' +
    ('00' + dateCreated.getMinutes()).slice(-2) +
    ':' +
    ('00' + dateCreated.getSeconds()).slice(-2);

  const dispatch = useDispatch();
  const deleteHandler = useCallback(() => {
    dispatch(deleteQuestion(courseId, questionId, page));
  }, [dispatch, courseId, questionId, page]);

  return (
    <div className={Classes.container}>
      <p className={Classes.topPart}>
        <b className={Classes.title}>{title}</b> <i>{authorName}</i>
        {authorId === userId && userIsInCourse ? (
          <Button
            disabled={deletingQuestion === questionId}
            style={{ marginLeft: '10px' }}
            onClick={deleteHandler}
            variant="danger"
            size="sm"
          >
            {deletingQuestion === questionId ? (
              <Spinner animation="border" size="sm" role="status">
                <span className="visually-hidden">Deleting...</span>
              </Spinner>
            ) : (
              'Delete Question'
            )}
          </Button>
        ) : null}
      </p>

      <i>({formattedDate})</i>

      <p>{description}</p>

      <RepliesSection
        courseId={courseId}
        questionId={questionId}
        userIsInCourse={userIsInCourse}
        replies={replies}
      />
    </div>
  );
};

export default Question;
