import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Badge, Spinner, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaUser, FaStar, FaEye } from "react-icons/fa";
import moment from "moment";
import './TagCloud.css'
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
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
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

          </div>
        </Col>
      </Row>

      {/* Latest Templates */}
      <Row className="mb-5">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4">Latest Templates</h2>

          </div>
          {latestTemplates.length === 0 ? (
            <Alert variant="light" className="text-center py-4">
              No templates available yet. {user && <Link to="/template">Create Your First Template</Link>}
            </Alert>
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
            <h2 className="h4">Most Popular Templates</h2>

          </div>
          {popularTemplates.length === 0 ? (
            <Alert variant="light" className="text-center py-4">
              No popular templates yet.
            </Alert>
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

const TemplateCard = ({ template }: TemplateCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  return (
    <Link to={`/${template.id}`} className="text-decoration-none ">
      <Card className="h-100 border-0 shadow-sm">
        <div className="position-relative" style={{ height: "200px", overflow: "hidden" }}>
          {template.imageUrl && !imageError ? (
            <>
              {imageLoading && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                  <Spinner animation="border" size="sm" />
                </div>
              )}
              <Card.Img
                variant="top"
                src={template.imageUrl}
                alt={template.title}
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  display: imageLoading ? "none" : "block"
                }}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            </>
          ) : (
            <div
              className="bg-light d-flex align-items-center justify-content-center h-100"
              style={{ backgroundColor: '#f8f9fa' }}
            >
              <div className="text-center p-3">
                <div className="text-muted mb-2">
                  {imageError ? 'Image failed to load' : 'No preview image'}
                </div>
                <div className="text-primary" style={{ fontSize: '2rem' }}>
                  {template.title.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          )}
        </div>

        <Card.Body className="d-flex flex-column">
          <Card.Title className="h5 mb-2">{template.title}</Card.Title>

          <div className="d-flex align-items-center mb-2 small text-muted">
            <FaUser className="me-2" />
            <span>By {template.author?.name || 'Anonymous'}</span>
          </div>

          <Card.Text className="flex-grow-1 mb-3">
            {template.description.length > 100
              ? `${template.description.substring(0, 100)}...`
              : template.description}
          </Card.Text>

          <div className="mb-3">
            <Badge bg="primary" className="me-2">{template.topic || 'General'}</Badge>
            {template.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag.id} bg="light" text="dark" className="me-2">
                {tag.name}
              </Badge>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Badge bg="light" text="dark" className="me-2">
                <FaStar className="text-warning me-1" />
                {template._count?.forms || 0} uses
              </Badge>
              <Badge bg="light" text="dark">
                <FaHeart className="text-danger me-1" />
                {template._count?.likes || 0} likes
              </Badge>
            </div>
            <div className="d-flex gap-2">
              <Link to={`/${template.id}`}>
                <Button
                  variant="outline-primary"
                  size="sm"
                >
                  <FaEye className="me-1" />
                  View
                </Button>
              </Link>

              <Link
                to={`/templates/${template.id}`}
                className="btn btn-primary btn-sm "
              >
                Response
              </Link>
            </div>

          </div>
        </Card.Body>

        <Card.Footer className="bg-white border-0 small text-muted">
          Created {moment(template.createdAt).fromNow()}
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default Home;