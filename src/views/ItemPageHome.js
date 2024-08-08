import { useNavigate, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, dB } from "../firebase";
import { useEffect, useState } from "react";
import { HomeNav } from "../templates/SiteNavBar";
import { adminList } from "../extFunctions";
import { Card, Container, Row, Col } from "react-bootstrap";
import { collection, getDocs } from "firebase/firestore";

export default function HomePage() {
    const [user, loading] = useAuthState(auth);
    const [isAdmin, setIsAdmin] = useState(false);
    const [itemList, setItemList] = useState([]);
    const navigate = useNavigate();

    async function getItems() {
        const query = await getDocs(collection(dB, "items"));
        const returnedList = query.docs.map((itemData) => {
            return {id: itemData.id, ...itemData.data()};
        });
        console.log(returnedList)
        setItemList(returnedList);
    }

    function EachItem({id, itemName, itemClass, itemState}) {
        let itemClassString = "";
        for (let i=0; i<itemClass.length;i++) {
            itemClassString = itemClassString + itemClass[i] + "/";
        }

        return (
                <Card id={id} style={{margin: "1rem"}}>
                    <Row>
                        <Col><Link to={`bookings/${id}`}>{itemName}</Link></Col>
                        <Col>{itemClassString}</Col>
                        <Col>{itemState}</Col>
                    </Row>
                </Card>
        )
    }

    function DisplayItems() {
        return itemList.map((item) => 
            <EachItem {...item} />
        ) 
    }

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        const checkAdmin = adminList.includes(user.uid);
        setIsAdmin(checkAdmin);
        getItems();
    }, [user, loading]);

    return (
        <>
            <HomeNav />
            <Container>
                {isAdmin && <div>You are an admin</div>}
                <DisplayItems />
            </Container>
        </>
    )
}