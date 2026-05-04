import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { useSound } from "./hooks/useSound";
import { usePreloadAssets } from "./hooks/usePreloadAssets";
import clickSfx from "./assets/sfx/click.wav";
import { PRELOAD_AUDIO_URLS, PRELOAD_IMAGE_URLS } from "./assets/preloadManifest";
import Endcard1Landscape from "./components/endcard1_landscape/endcard1_landscape.jsx";
import Endcard1Portrait from "./components/endcard1_portrait/endcard1_portrait.jsx";
import Endcard2Landscape from "./components/endcard2_landscape";
import Endcard2Portrait from "./components/endcard2_portrait";
import MIP02 from "./components/MIP02/MIP02.jsx";

const COMPONENTS = [
  {
    id: "endcard1-portrait",
    label: "Endcard 1 Portrait",
    Component: Endcard1Portrait,
  },
  {
    id: "endcard1-landscape",
    label: "Endcard 1 Landscape",
    Component: Endcard1Landscape,
  },
    {
    id: "endcard2-portrait",
    label: "Endcard 2 Portrait",
    Component: Endcard2Portrait,
  },
  {
    id: "endcard2-landscape",
    label: "Endcard 2 Landscape",
    Component: Endcard2Landscape,
  },
  {
    id: "mip02",
    label: "MIP02",
    Component: MIP02,
  },
];

function getBasePath() {
  const pathname = window.location.pathname.replace(/\/+$/, "");
  const componentPathIndex = pathname.indexOf("/components/");

  if (componentPathIndex >= 0) {
    return pathname.slice(0, componentPathIndex) || "";
  }

  return pathname === "/" ? "" : pathname;
}

function getCurrentPath() {
  const hashPath = window.location.hash.replace(/^#/, "").replace(/\/+$/, "");
  if (hashPath) return hashPath.startsWith("/") ? hashPath : `/${hashPath}`;

  const basePath = getBasePath();
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

  if (basePath && pathname.startsWith(basePath)) {
    const strippedPath = pathname.slice(basePath.length);
    return strippedPath || "/";
  }

  return pathname;
}

function getComponentFromPath(pathname) {
  const match = pathname.match(/^\/components\/([^/]+)$/);
  if (!match) return null;
  return COMPONENTS.find((item) => item.id === match[1]) ?? null;
}

export default function App() {
  const [pathname, setPathname] = useState(() => getCurrentPath());
  const playClick = useSound(clickSfx, 0.45);
  usePreloadAssets(PRELOAD_IMAGE_URLS, PRELOAD_AUDIO_URLS);

  useEffect(() => {
    const syncPath = () => setPathname(getCurrentPath());
    window.addEventListener("popstate", syncPath);
    window.addEventListener("hashchange", syncPath);
    return () => {
      window.removeEventListener("popstate", syncPath);
      window.removeEventListener("hashchange", syncPath);
    };
  }, []);

  useEffect(() => {
    const component = getComponentFromPath(pathname);
    const isMIP02Page = component?.id === "mip02";
    document.body.classList.toggle("mip02-page", isMIP02Page);
    return () => document.body.classList.remove("mip02-page");
  }, [pathname]);

  const activeComponent = useMemo(() => getComponentFromPath(pathname), [pathname]);

  if (activeComponent) {
    const ActiveComponent = activeComponent.Component;
    return (
      <div className="componentOnlyPage">
        <ActiveComponent />
      </div>
    );
  }

  return (
    <div className="showcaseShell">
      <main className="showcaseBrowser">
        <p className="showcaseDescription">
          Select a component to open it.
        </p>
        <div className="showcaseNav">
          {COMPONENTS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="showcaseButton"
              onClick={() => {
                playClick();
                window.open(
                  `./#/components/${item.id}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <span className="showcaseButtonLabel">{item.label}</span>
              <span className="showcaseButtonMeta">{item.description}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
