import { Switch, Route, Router, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Admin from "@/pages/Admin";
import Events from "@/pages/Events";
import Archive from "@/pages/Archive";
import NotFound from "@/pages/not-found";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";
import { LangContext, type Lang } from "@/lib/langContext";
import { initTracker, getTracker } from "@/lib/tracker";

// Admin secret path
const ADMIN_PATH = "/admin-bifi2024xK9mPqR";

// Page change tracker
function PageTracker() {
  const [location] = useLocation();
  const prevRef = useRef("");
  useEffect(() => {
    if (prevRef.current && prevRef.current !== location) {
      getTracker().trackPageChange(location);
    }
    prevRef.current = location;
  }, [location]);
  return null;
}

function isAdminPath() {
  // hash 라우팅: window.location.hash = "#/admin-bifi2024xK9mPqR"
  const hash = window.location.hash.replace(/^#/, "") || "/";
  return hash === ADMIN_PATH;
}

function AppInner() {
  const [location] = useLocation();
  // useLocation이 초기 빈 값일 때도 window.hash로 즉시 판단
  const adminNow = location === ADMIN_PATH || isAdminPath();

  if (adminNow) {
    return <Admin />;
  }

  return (
    <>
      <PageTracker />
      <Nav />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/event" component={Events} />
          <Route path="/archive" component={Archive} />
          <Route path={ADMIN_PATH} component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </>
  );
}

function App() {
  const [lang, setLang] = useState<Lang>("KR");

  const toggleLang = () => setLang(prev => (prev === "KR" ? "EN" : "KR"));

  // Init tracker once
  useEffect(() => {
    initTracker();
  }, []);

  // 항상 라이트 테마 고정
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      <QueryClientProvider client={queryClient}>
        <Router hook={useHashLocation}>
          <AppInner />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </LangContext.Provider>
  );
}

export default App;
