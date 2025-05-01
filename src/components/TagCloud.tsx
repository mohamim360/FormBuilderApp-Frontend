// src/components/TagCloud.tsx
import { useEffect, useState } from "react";
import { Badge, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TemplateService } from "../services/templateService";


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
        setError("Failed to load tags");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) {
    return <Spinner animation="border" size="sm" />;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  if (tags.length === 0) {
    return <div>No tags available yet.</div>;
  }

  // Calculate size based on count (simple logarithmic scaling)
  const maxCount = Math.max(...tags.map((tag) => tag.count));
  const minCount = Math.min(...tags.map((tag) => tag.count));

  return (
    <div className="d-flex flex-wrap gap-2">
      {tags.map((tag) => {
        // Calculate size between 0.8 and 1.5 based on count
        const size = 0.8 + (0.7 * (tag.count - minCount)) / (maxCount - minCount || 1);
        return (
          <Link
            key={tag.id}
            to={`/search?q=${encodeURIComponent(tag.name)}`}
            style={{ textDecoration: "none" }}
          >
            <Badge
              pill
              bg="light"
              text="dark"
              style={{
                fontSize: `${size}rem`,
                padding: "0.5em 0.75em",
                transition: "all 0.2s ease",
              }}
              className="hover-shadow"
            >
              {tag.name} <small>({tag.count})</small>
            </Badge>
          </Link>
        );
      })}
    </div>
  );
};

export default TagCloud;