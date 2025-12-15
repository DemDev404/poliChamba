import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), 

  route("login", "routes/login.tsx"), 
  route("register", "routes/register.tsx"), 
  route("home", "routes/candidate-home.tsx"), 
  route("company/dashboard", "routes/company-home.tsx"),
  route("admin/dashboard", "routes/admin-home.tsx"),
  route("company/jobs/create", "routes/job-create.tsx"),

] satisfies RouteConfig;

