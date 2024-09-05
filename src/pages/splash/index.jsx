import useSpashHook from "../../hooks/useSplashHook";

const SplashScreen = () => {
    const {entites} = useSpashHook()
    console.log('entites', entites)
  return <div>Splash Screen</div>;
};

export default SplashScreen;
