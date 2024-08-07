import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { HomeNav } from "../templates/SiteNavBar";
import { checkAdmin } from "../extFunctions";
import { Container } from "react-bootstrap";

export default function HomePage() {
    const [user, loading] = useAuthState(auth);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        setIsAdmin(checkAdmin(user.uid));
    }, [user, loading, navigate]);

    return (
        <>
            <HomeNav />
            <Container>
                {isAdmin && <div>You are an admin</div>}
            </Container>
        </>
    )
}