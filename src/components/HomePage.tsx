// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Table, Badge, Spinner } from "react-bootstrap";
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
          <h1 className="display-4">Create and Share Custom Forms</h1>
          <p className="lead">
            Build beautiful forms, surveys, and quizzes. Gather responses and analyze results.
          </p>
          {!user && (
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started - It's Free
            </Link>
          )}
        </Col>
      </Row>

      {/* Latest Templates Gallery */}
      <Row className="mb-5">
        <Col>
          <h2 className="mb-4">Latest Templates</h2>
          {latestTemplates.length === 0 ? (
            <p>No templates available yet.</p>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {latestTemplates.map((template) => (
                <Col key={template.id}>
                  <TemplateCard template={template} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* Popular Templates Table */}
      <Row className="mb-5">
        <Col>
          <h2 className="mb-4">Most Popular Templates</h2>
          {popularTemplates.length === 0 ? (
            <p>No popular templates yet.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Responses</th>
                  <th>Likes</th>
                </tr>
              </thead>
              <tbody>
                {popularTemplates.map((template) => (
                  <tr key={template.id}>
                    <td>
                      <Link to={`/templates/${template.id}`}>{template.title}</Link>
                    </td>
                    <td>
                      <Link to={`/users/${template.author.id}`}>{template.author.name}</Link>
                    </td>
                    <td>{template._count.forms}</td>
                    <td>{template._count.likes}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>

      {/* Tag Cloud */}
      <Row className="mb-5">
        <Col>
          <h2 className="mb-4">Browse by Tags</h2>
          <TagCloud />
        </Col>
      </Row>
    </Container>
  );
};

const TemplateCard = ({ template }: { template: Template }) => {
  return (
    <Card className="h-100 shadow-sm">
      {template.imageUrl && (
        <Card.Img
          variant="top"
          src={template.imageUrl}
          alt={template.title}
          style={{ height: "180px", objectFit: "cover" }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{template.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          by {template.author.name}
        </Card.Subtitle>
        <Card.Text className="flex-grow-1">
          {template.description.length > 100
            ? `${template.description.substring(0, 100)}...`
            : template.description}
        </Card.Text>
        <div className="mt-auto">
          <div className="mb-2">
            {template.tags?.map((tag) => (
              <Badge key={tag.id} bg="secondary" className="me-1">
                {tag.name}
              </Badge>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {template._count.forms} responses • {template._count.likes} likes
            </small>
            <Link to={`/templates/${template.id}`} className="btn btn-sm btn-primary">
              View
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Home;