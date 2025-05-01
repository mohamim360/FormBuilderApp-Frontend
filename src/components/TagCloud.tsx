import { useEffect, useState } from "react";
import { Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TemplateService } from "../services/templateService";
import "./TagCloud.css";

interface Tag {
  id: string;
  name: string;
  count: number;
}

const TagCloud = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await TemplateService.getPopularTags();
        setTags(response);
      } catch (err) {
        setError("Failed to load tags. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading tags...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="warning" className="text-center">
        {error}
        <button 
          className="btn btn-sm btn-outline-primary ms-2"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </Alert>
    );
  }

  if (tags.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        No tags available yet. Create templates to generate tags.
      </Alert>
    );
  }

  // Calculate visual properties based on popularity
  const maxCount = Math.max(...tags.map(tag => tag.count));
  const minCount = Math.min(...tags.map(tag => tag.count));

  // Find the longest tag name to determine max width
  const maxTagLength = Math.max(...tags.map(tag => tag.name.length));

  return (
    <div className="tag-cloud-container">
      <h5 className="tag-cloud-title">Browse Popular Tags</h5>
      <div className="tag-cloud-content">
        <div className="tag-cloud-inner">
          {tags.map(tag => {
            const popularity = (tag.count - minCount) / (maxCount - minCount || 1);
            const size = 0.9 + popularity * 0.6; // 0.9rem to 1.5rem
            const hue = 210 - popularity * 40; // Blue to purple gradient
            const saturation = 85;
            const lightness = 50 + popularity * 10;
            
            return (
              <Link
                key={tag.id}
                to={`/templates/search?q=${encodeURIComponent(tag.name)}`}
                className="tag-item"
                style={{
                  fontSize: `${size}rem`,
                  color: 'white',
                  backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                  boxShadow: `0 2px 4px hsla(${hue}, ${saturation}%, ${lightness - 20}%, 0.3)`,
                  width: `${maxTagLength * 0.6}em`, // Adjust multiplier as needed
                }}
                aria-label={`Browse ${tag.name} templates (${tag.count} available)`}
              >
                {tag.name}
                <span className="tag-count"> ({tag.count})</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="tag-cloud-footer">
        <small>Click any tag to explore related templates</small>
      </div>
    </div>
  );
};

export default TagCloud;