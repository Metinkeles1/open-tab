import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function AppContainer({ children }: Props) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 h-full overflow-hidden flex flex-col">
      {children}
    </div>
  );
}
