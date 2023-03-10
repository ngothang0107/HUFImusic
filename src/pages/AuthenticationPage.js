import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import SignInForm from "../components/Form/SignInForm";
import SignUpForm from "../components/Form/SignUpForm";
import ResetPasswordForm from "../components/Form/ResetPasswordForm";

import { useDispatch } from "react-redux";
import { setUser } from "../features/User/userFeatures";

import { auth, database } from "../firebase/firebase-config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
const provider = new GoogleAuthProvider();

const SignUpStyles = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--layout-bg);
    z-index: 8888;
    transition: all 0.3s;
    overflow-y: auto;
    .sider {
        margin-bottom: 2rem;
        .sider_brand-item {
            font-size: 4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: "Patrick Hand SC", cursive;

            transition: 0.2s ease-in;

            p {
                font-size: 4rem;
                display: flex;
                -webkit-box-align: center;
                align-items: center;
                font-family: "Patrick Hand SC", cursive;
                transition: 0.2s ease-in;
            }

            &:hover {
                opacity: 0.8;
                cursor: pointer;
            }

            span {
                font-size: 3rem;
                margin-left: 6px;
                font-family: "Patrick Hand SC", cursive;
            }

            .sider_brand-item-img {
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    max-height: 42px;
                    filter: grayscale(100%);
                    margin-right: 10px;
                }
            }
        }
    }

    .authForm {
        position: relative;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        align-items: stretch;
        -webkit-box-shadow: 0px 2px 6px 0px #1d2030;
        box-shadow: 0px 2px 6px 0px #1d2030;
        .left {
            background-color: rgb(12 14 33 / 92%);
            color: #ffffff;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            padding-top: 30px;
            padding-bottom: 40px;
            padding-right: 30px;
            padding-left: 30px;
        }

        .right {
            padding-top: 30px;
            padding-bottom: 40px;
            padding-right: 30px;
            padding-left: 30px;
            background-color: #ffffff;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            color: #2d385e;
            .text-header {
                font-size: 20px;
                font-weight: 500;

                &.active {
                    font-size: 30px;
                    font-weight: 700;
                }
            }
        }

        .btnAuth {
            padding: 8px 8px;
            width: 100%;
            border: 1px solid transparent;
            border-radius: 4px;
            transition: all 0.2s;
            &:hover {
                opacity: 0.8;
            }
        }
    }

    .form-control {
        background-color: #fff;
        width: 100%;
        color: #333333;
        font-size: 18px;
        height: 50px;
        margin-top: 16px;
        padding: 12px 22px;
        border-radius: 4px;
        border: solid 1px #bcc2ce;
        outline: none;
        -webkit-box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 10%), 0 0 2px 0 rgba(0, 0, 0, 10%);
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 10%), 0 0 2px 0 rgba(0, 0, 0, 10%);
    }
    .btn-login {
        color: white;
        width: 100%;
        padding: 12px;
        margin-top: 2rem;
        font-size: 16px;
        font-weight: 500;
        border-radius: 4px;
        background-color: #486ff2;
        border-color: #486ff2;
        box-shadow: 0px 2px 3px #9c9c9c;

        &:hover {
            opacity: 0.8;
            cursor: pointer;
        }
    }

    @media (max-width: 719px) {
        .left,
        .right {
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
        }

        .left {
            flex-direction: column !important;
        }
        .sider {
            margin-bottom: 1rem;
        }
    }
`;
const AuthenticationPage = () => {
    const [sign, setSign] = useState(0);
    const navigate = useNavigate();
    const handleNavigateHome = () => {
        navigate("/");
    };
    const dispatch = useDispatch();
    const handleSigninWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;

                const docRef = doc(database, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if(!docSnap.data()) {
                    await setDoc(doc(database, "users", user.uid), {
                        email: user.email,
                        password: '',
                        name: user.displayName,
                        id: user.uid,
                        favouriteSongs: [],
                        favouritePlaylist: [],
                        favouriteArtist: [],
                        myAlbum: [],
                        admin: false,
                        timestamp: serverTimestamp(),
                    });
                }

                dispatch(
                    setUser({
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        email: user.email,
                        uid: user.uid,
                        admin: docSnap?.data()?.admin || false,
                    })
                );

                navigate('/');

            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error?.code;
                const errorMessage = error?.message;
                // The email of the user's account used.
                const email = error?.customData?.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    };
    return (
        <SignUpStyles>
            <div className="gird wide">
                <div className="flex w-full h-[100vh] items-center justify-center">
                    <div className=" mb-[5rem] l-8 m-10 c-12">
                        <div className="row !flex-wrap authForm">
                            <div className="col l-5 m-5 c-12   left flex items-center justify-center ">
                                <div className="sider">
                                    <div onClick={handleNavigateHome} className="sider_brand-item">
                                        <div className="sider_brand-item-img">
                                            <img src="/pabicon.webp" alt="logo-dat-mp3" />
                                        </div>
                                        <p className="sider_brand-item-text">
                                            HUFI <span>MP3</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="text-center mb-[2rem]  font-semibold">
                                    ????ng nh???p b???ng m???ng x?? h???i ????? truy c???p nhanh
                                </div>

                                <div className="flex flex-col justify-start items-center gap-[16px]">
                                    {/* <button className="btnAuth bg-[#3b5998]">Ti???p t???c v???i Facebook</button> */}
                                    <button onClick={handleSigninWithGoogle} className="btnAuth bg-[#c32f10] ">
                                        Ti???p t???c v???i Google
                                    </button>
                                    {/* <button className="btnAuth bg-[#2B3137]">Ti???p t???c v???i Github</button> */}
                                </div>
                            </div>

                            <div className="col l-7 m-7 c-12 right">
                                <div className="flex  items-baseline justify-center ">
                                    <div className="text-header active">
                                        {sign === 0 ? "????ng Nh???p" : sign === 1 ? "????ng K??" : "Qu??n m???t kh???u"}
                                    </div>
                                </div>

                                {sign === 0 ? (
                                    <SignInForm setSign={setSign}></SignInForm>
                                ) : sign === 1 ? (
                                    <SignUpForm setSign={setSign}></SignUpForm>
                                ) : sign === 2 ? (
                                    <ResetPasswordForm setSign={setSign} />
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SignUpStyles>
    );
};

export default AuthenticationPage;
