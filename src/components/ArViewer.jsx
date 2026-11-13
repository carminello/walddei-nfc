"use client";

import ArchiTetris from "./ArchiTetris";

export default function ArViewer({ arConfig, brandConfig, onClose }) {
  return (
    <div className="w-full">
      <ArchiTetris
        arConfig={arConfig}
        brandConfig={brandConfig}
        onClose={onClose}
      />
    </div>
  );
}
