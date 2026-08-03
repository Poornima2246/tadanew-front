import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.forgotPassword({ email });
      
      if (response.data.success) {
        setSuccess(true);
        toast.success('Password reset link sent to your email!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset link. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container fluid className="auth-container">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <Card className="auth-card shadow-lg">
              <Card.Body className="p-5 text-center">
                <div className="mb-4">
                  <i className="fas fa-check-circle text-success fa-4x mb-3"></i>
                  <h3 className="auth-title">Check Your Email</h3>
                  <p className="text-muted">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="text-muted small">
                    If you don't see the email, check your spam folder or try again.
                  </p>
                </div>
                <div className="d-grid gap-2">
                  <Link to="/login" className="btn btn-primary">
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Login
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="auth-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={10} md={8} lg={5} xl={4}>
          <Card className="auth-card shadow-lg">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="auth-logo mb-3">
                  <i className="fas fa-key text-warning fa-3x"></i>
                </div>
                <h2 className="auth-title">Reset Password</h2>
                <p className="auth-subtitle text-muted">
                  Enter your email to receive a reset link
                </p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-3">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="form-label">
                    <i className="fas fa-envelope me-2 text-primary"></i>
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="form-control-custom"
                    disabled={loading}
                  />
                </Form.Group>

                <div className="d-grid mb-4">
                  <Button
                    variant="warning"
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="auth-button"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </div>
              </Form>

              <div className="text-center">
                <p className="mb-0">
                  Remember your password?{' '}
                  <Link to="/login" className="text-decoration-none fw-bold text-primary">
                    Back to Login
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;