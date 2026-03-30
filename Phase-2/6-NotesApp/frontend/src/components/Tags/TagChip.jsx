import React from 'react';

const TagChip = ({ tag }) => {
  return (
    <span className="tag-chip">
      {tag.name}
    </span>
  );
};

export default TagChip;
