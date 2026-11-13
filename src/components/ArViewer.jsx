"use client";

import SpatialArtifactViewer from "./SpatialArtifactViewer";

export default function ArViewer({ arConfig, brandConfig, onClose }) {
  return (
    <div className="w-full">
      <SpatialArtifactViewer
        arConfig={arConfig}
        brandConfig={brandConfig}
        onClose={onClose}
      />
    </div>
  );
}
