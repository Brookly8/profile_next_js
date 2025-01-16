import React from "react";

export default function UserProfile({ params }: any) {
  return (
    <div className="flex flex-col justify-center items-center  min-h-screen">
      Profile {params.id}
    </div>
  );
}
