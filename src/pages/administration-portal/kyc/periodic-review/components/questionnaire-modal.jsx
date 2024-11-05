import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Form, Spinner, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { updateQuestionPerodic } from '../../../../../api/network/AdministrationApi/AdministrationApi';

export default function QuestionnaireModal({ show, handleClose, showAlert, questions, selectedRow, getPeriodicList }) {
  const [mode, setMode] = useState(null);
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [allAnswered, setAllAnswered] = useState(false);
  const params = useParams();
  const cancelTokenSource = axios.CancelToken.source();

  useEffect(() => {
    if (selectedRow?.meta?.questionAnswers?.length > 0) {
      const initialAnswers = {};
      const initialComments = {};
      selectedRow.meta.questionAnswers.forEach(({ question, answer, comment }) => {
        initialAnswers[question] = answer;
        initialComments[question] = comment || '';
      });
      setAnswers(initialAnswers);
      setComments(initialComments);
    }
  }, [selectedRow]);

  useEffect(() => {
    const allAnsweredCheck = (questions || []).every(question => answers[question] === 'Yes' || answers[question] === 'No');
    setAllAnswered(allAnsweredCheck);
  }, [questions, answers]);

  const handleChange = (question, answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [question]: answer,
    }));
  };

  const handleChangeComment = (question, comment) => {
    setComments(prevComments => ({
      ...prevComments,
      [question]: comment,
    }));
  };

  const handleSubmit = useCallback(async (submitMode) => {
    setMode(submitMode);
    setLoading(true);
    const questionAnswer = questions.map(question => ({
      question,
      answer: answers[question] || '',
      comment: comments[question] || '',
    }));

    const dataToSend = {
      id: selectedRow?.id,
      questionAnswer,
      save: submitMode === "save",
      completed: submitMode !== "save",
    };

    try {
      const response = await updateQuestionPerodic(dataToSend, params?.fund_id, cancelTokenSource.token);
      if (response?.success) {
        showAlert('Submitted successfully!', 'success');
        handleClose();
        getPeriodicList();
      } else {
        showAlert('Submission failed!', 'danger');
      }
    } catch (error) {
      showAlert('An error occurred!', 'danger');
    } finally {
      setLoading(false);
    }
  }, [answers, comments, questions, selectedRow, params, cancelTokenSource.token, showAlert, handleClose, getPeriodicList]);

  return (
    <Modal centered show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: '24px' }}>Periodic Review Check list</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {questions && questions.length > 0 ? (
          <Form>
            <ol style={{ paddingLeft: '1.5rem', margin: 0 }}>
              {questions.map((question, index) => (
                <li key={index} style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem', lineHeight: '1.5', listStylePosition: 'outside' }}>
                  <Form.Group>
                    <Row>
                      <Col xs={12} sm={6} md={6} lg={6} style={{ fontSize: '0.8rem', paddingTop: '0.5rem' }}>
                        <Form.Label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>
                          {question}
                        </Form.Label>
                      </Col>
                      <Col xs={2} sm={2} md={2} lg={2} className="d-flex align-items-start mt-1">
                        <Form.Check
                          type="radio"
                          label="Yes"
                          name={`question-${index}`}
                          onChange={() => handleChange(question, 'Yes')}
                          checked={answers[question] === 'Yes'}
                          style={{ marginRight: '10px' }}
                        />
                        <Form.Check
                          type="radio"
                          label="No"
                          name={`question-${index}`}
                          onChange={() => handleChange(question, 'No')}
                          checked={answers[question] === 'No'}
                        />
                      </Col>
                      <Col xs={4} sm={4} md={4} lg={4} style={{ fontSize: '0.8rem', paddingTop: '0.2rem' }}>
                        <Form.Control
                          as="textarea"
                          placeholder="Add comment here"
                          rows={2}
                          style={{ resize: 'none' }}
                          onChange={e => handleChangeComment(question, e.target.value)}
                          value={comments[question] || ''}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                  <hr style={{ backgroundColor: '#B0BEC5', marginBottom: '0.5rem', height: '0.1px' }} />
                </li>
              ))}
            </ol>
          </Form>
        ) : (
          <p>No questions available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: '10px' }}>
          <Button
            style={{ backgroundColor: '#E4A11B', borderColor: '#E4A11B' }}
            onClick={() => handleSubmit('save')}
            disabled={loading || !allAnswered}
          >
            {loading && mode === 'save' ? <Spinner animation="border" size="sm" /> : 'Save and Draft'}
          </Button>
          <Button
            style={{ backgroundColor: '#14A44D', borderColor: '#14A44D' }}
            onClick={() => handleSubmit('save&complete')}
            disabled={loading || !allAnswered}
          >
            {loading && mode !== 'save' ? <Spinner animation="border" size="sm" /> : 'Complete'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}