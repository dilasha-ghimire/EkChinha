import DemoRedirect from "./DemoRedirect";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EsewaDemoRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return <DemoRedirect type="esewa" />;
}
