import { Link, Navigate } from "react-router-dom";
import main from "../assets/images/main.svg";
import Wrapper from "../assets/wrappers/LandingPage";
import { Logo } from "../components";
import { useAppContext } from "../context/appContext";

const Landing = () => {
  const { user } = useAppContext();
  return (
    <>
      {user && <Navigate to="/" />}
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          {/* info */}
          <div className="info">
            <h1>
              Job <span>tracking</span> app
            </h1>
            <p>
              I'm baby kogi kickstarter pug hexagon migas kitsch. Bodega boys
              tacos af fanny pack wayfarers. Bitters taiyaki retro, seitan
              gentrify poutine vaporware bespoke sustainable. Snackwave try-hard
              live-edge marfa pabst, biodiesel bicycle rights farm-to-table tofu
              direct trade locavore selfies.
            </p>
            <Link to="/register" className="btn btn-hero">
              login/register
            </Link>
          </div>
          {/* image */}
          <img src={main} alt="Job hunt" className="img main-img" />
        </div>
      </Wrapper>
    </>
  );
};

export default Landing;
