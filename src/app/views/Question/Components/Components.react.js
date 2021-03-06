/* eslint-disable import/prefer-default-export */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'react-sweet-progress';
import Options from './Options';
import 'react-sweet-progress/lib/style.css';
import {
  QuestionBy,
  Name,
  Headline,
  AnimatedDiv,
  ResultBarContainer,
  Container,
  SubmitButton,
} from '../Question.styled';

export const AuthorName = ({ name }) => {
  AuthorName.propTypes = { name: PropTypes.string.isRequired };
  return (
    <QuestionBy>
      <i>Question By:</i>
      <br />
      <Name>
        <b>{name}</b>
      </Name>
    </QuestionBy>
  );
};
/**
 * @description Renders / Removes an Animated Component
 * @param  {Boolean} {show should Animation be shown initiated?
 * @param  {JSX} children Content to be rendered
 * @param  {Boolean} shouldRender actually render component
 * @param  {Function} setRender} function to toggle {shouldRender}
 */
export const Fade = ({ show, children, shouldRender, setRender }) => {
  Fade.propTypes = {
    show: PropTypes.bool.isRequired,
    // children: PropTypes.oneOfType([
    //   PropTypes.arrayOf(
    //     PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.object]),
    //   ),
    //   PropTypes.object,
    // ]).isRequired,
    children: PropTypes.any.isRequired,
    shouldRender: PropTypes.bool.isRequired,
    setRender: PropTypes.func.isRequired,
  };
  useEffect(() => {
    if (show) setRender(true);
  }, [setRender, show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  return (
    shouldRender && (
      <AnimatedDiv show={show} onAnimationEnd={onAnimationEnd}>
        {children}
      </AnimatedDiv>
    )
  );
};

export const ProgressBar = ({ result }) => {
  ProgressBar.propTypes = { result: PropTypes.number };
  ProgressBar.defaultProps = { result: 73 };
  return (
    <ResultBarContainer>
      <Progress
        width={150}
        percent={result}
        strokeWidth={10}
        status="success"
        theme={{
          success: {
            trailColor: 'lime',
            color: 'green',
          },
        }}
      />
      <br />
      <div style={{ fontWeight: 'bold', color: '#001427', fontSize: 25 }}>
        {result}% of Users Share your Opinion!
      </div>
    </ResultBarContainer>
  );
};

/**
 * @description Takes in dynamic arguments on whether to create or display a Question
 */

export const generateContent = (
  type,
  input,
  handleSubmit,
  path,
  session,
  question,
  filter,
  setQuestionAnswer,
  selected,
) => {
  let title = session ? 'Submit Answer' : 'Please Login first!';
  let text = session ? 'Submit!' : 'LOGIN';
  if (path === '/' && session) {
    title = 'View Question';
    text = 'View Question';
  }
  switch (type) {
    /* --------------------------------- CREATE --------------------------------- */
    case 'create':
      return (
        <Container creatingQuestion>
          <Headline>Would you rather...</Headline>
          {input}
          <SubmitButton title={title} onClick={() => handleSubmit()}>
            Create
          </SubmitButton>
        </Container>
      );

    /* --------------------------------- DISPLAY -------------------------------- */
    case 'display':
      return (
        <Container creatingQuestion={false} renderResults={false}>
          <Headline>Would you rather...</Headline>
          <Options
            question={question}
            optionOne={question.optionOne.text}
            optionTwo={question.optionTwo.text}
            session={session}
            path={path}
            filter={filter}
            setQuestionAnswer={setQuestionAnswer}
            selected={selected}
          />
          <SubmitButton title={title} onClick={handleSubmit}>
            {text}
          </SubmitButton>
        </Container>
      );

    /* --------------------------------- RESULT --------------------------------- */

    case 'result':
      return (
        <Container creatingQuestion={false} renderResults>
          <Headline>Would you rather...</Headline>
          <Options
            renderResults
            question={question}
            optionOne={question.optionOne.text}
            optionTwo={question.optionTwo.text}
            session={session}
            path={path}
            filter={filter}
            setQuestionAnswer={setQuestionAnswer}
            selected={selected}
          />
          <ProgressBar result={getResult(question, selected)} />
        </Container>
      );
    default:
      return null;
  }
};

const getResult = (q, selected) =>
  Math.round(
    100 *
      ((selected === 'optionOne' ? q.optionOne.votes.length : q.optionTwo.votes.length) /
        (q.optionOne.votes.length + q.optionTwo.votes.length) +
        Number.EPSILON) *
      100,
  ) / 100;
