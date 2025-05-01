// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Badge, Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { Template } from "../types/types";
import TagCloud from "../components/TagCloud";
import { TemplateService } from "../services/templateService";

const Home = () => {
  const { user } = useAuth();
  const [latestTemplates, setLatestTemplates] = useState<Template[]>([]);
  const [popularTemplates, setPopularTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [latest, popular] = await Promise.all([
          TemplateService.getLatestTemplates(),
          TemplateService.getPopularTemplates(),
        ]);
        setLatestTemplates(latest);
        setPopularTemplates(popular);
      } catch (err) {
        setError("Failed to load templates. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* Hero Section */}
      <Row className="mb-5 text-center">
        <Col>
          <h1 className="display-4 fw-bold mb-4">Create and Share Custom Forms</h1>
          <p className="lead mb-4">
            Build beautiful forms, surveys, and quizzes. Gather responses and analyze results.
          </p>
          <div className="d-flex justify-content-center gap-3">
            {!user ? (
              <Link to="/register" className="btn btn-primary btn-lg px-4">
                Get Started - It's Free
              </Link>
            ) : (
              <Link to="/template" className="btn btn-primary btn-lg px-4">
                Create New Template
              </Link>
            )}
            <Link to="/templates/search" className="btn btn-outline-secondary btn-lg px-4">
              Browse Templates
            </Link>
          </div>
        </Col>
      </Row>

      {/* Latest Templates */}
      <Row className="mb-5">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Latest Templates</h2>
            <Link to="/templates/search" className="btn btn-outline-primary">
              View All
            </Link>
          </div>
          {latestTemplates.length === 0 ? (
            <div className="text-center py-5 bg-light rounded">
              <p className="text-muted">No templates available yet.</p>
              {user && (
                <Link to="/template" className="btn btn-primary">
                  Create Your First Template
                </Link>
              )}
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {latestTemplates.map((template) => (
                <Col key={`latest-${template.id}`}>
                  <TemplateCard template={template} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* Popular Templates */}
      <Row className="mb-5">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Most Popular Templates</h2>
            <Link to="/templates/search" className="btn btn-outline-primary">
              View All
            </Link>
          </div>
          {popularTemplates.length === 0 ? (
            <div className="text-center py-5 bg-light rounded">
              <p className="text-muted">No popular templates yet.</p>
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {popularTemplates.map((template) => (
                <Col key={`popular-${template.id}`}>
                  <TemplateCard template={template} showPopularity={true} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* Tag Cloud */}
      <Row className="mb-5">
        <Col>
          <h2 className="mb-4">Browse by Tags</h2>
          <div className="p-4 bg-light rounded">
            <TagCloud />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

interface TemplateCardProps {
  template: Template;
  showPopularity?: boolean;
}

const TemplateCard = ({ template, showPopularity = false }: TemplateCardProps) => {
  return (
    <Card className="h-100 shadow-sm border-0 overflow-hidden hover-shadow">
      {template.imageUrl ? (
        <div className="position-relative" style={{ height: "180px", overflow: "hidden" }}>
          <Card.Img
            variant="top"
            src={template.imageUrl}
            alt={template.title}
            style={{ 
              height: "100%", 
              width: "100%", 
              objectFit: "cover",
              transition: "transform 0.3s ease"
            }}
            className="hover-zoom"
          />
          <div className="position-absolute top-0 end-0 m-2">
            <Badge bg="success" pill>
              {template._count.forms} responses
            </Badge>
          </div>
          {showPopularity && (
            <div className="position-absolute top-0 start-0 m-2">
              <Badge bg="danger" pill>
                <i className="bi bi-fire me-1"></i> Popular
              </Badge>
            </div>
          )}
        </div>
      ) : (
        <div 
          className="bg-secondary" 
          style={{ height: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <span className="text-white">No preview image</span>
        </div>
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-5 fw-bold">{template.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted small">
          by {template.author.name}
        </Card.Subtitle>
        <Card.Text className="flex-grow-1 small text-muted">
          {template.description.length > 100
            ? `${template.description.substring(0, 100)}...`
            : template.description}
        </Card.Text>
        <div className="mt-auto">
          <div className="mb-2">
            {template.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag.id} bg="light" text="dark" className="me-1">
                {tag.name}
              </Badge>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Badge bg="primary" className="me-1">
                {template.category || "General"}
              </Badge>
              {showPopularity && (
                <Badge bg="warning" text="dark">
                  <i className="bi bi-heart-fill me-1"></i>
                  {template._count.likes}
                </Badge>
              )}
            </div>
            <Link 
              to={`/templates/${template.id}`} 
              className="btn btn-sm btn-primary"
            >
              Use Template
            </Link>
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="bg-white border-0">
        <small className="text-muted">
          Last updated {new Date(template.updatedAt).toLocaleDateString()}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default Home;