"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import the playground component to prevent any SSR issues
const EditorPlayground = dynamic(() => import("./playground"), {
  ssr: false,
});

export default function EditorPage() {
  const params = useParams();

  return <EditorPlayground />;
}