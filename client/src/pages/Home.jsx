import { useSelector } from "react-redux";



function Home() {

    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );
    const auth = useSelector((state) => state.auth);


    return (
        <div className="p-10">
            <h1 className="text-4xl font-bold">
                Home Page
            </h1>
            <h2>{user?.fullName}</h2>

            <p>{isAuthenticated ? "Logged In" : "Not Logged In"}</p>
        </div>
    )
}

export default Home;