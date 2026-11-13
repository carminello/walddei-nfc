"use client";

import ArchiTetris from "./ArchiTetris";

export default function ArViewer({ arConfig, brandConfig, contactsConfig, onClose }) {
  return (
    <div className="w-full">
      <ArchiTetris
        arConfig={arConfig}
        brandConfig={brandConfig}
        contactsConfig={contactsConfig}
        onClose={onClose}
      />
    </div>
  );
}
