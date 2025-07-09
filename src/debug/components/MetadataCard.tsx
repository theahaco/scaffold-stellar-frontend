const MetadataCard = ({
  title,
  content,
}: {
  title?: string;
  content: string;
}) => {
  return (
    <div
      style={{
        backgroundColor: "#F3F3F3",
        padding: "0.8rem",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "fit-content",
        border: "1px solid #E2E2E2",
      }}
    >
      <div
        style={{
          fontSize: "0.85rem",
          color: "#333",
          marginBottom: "0.15rem",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "1rem",
          fontWeight: "bold",
          color: "#000",
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default MetadataCard;
