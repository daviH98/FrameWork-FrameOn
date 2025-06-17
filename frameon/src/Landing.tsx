import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";

const Landing: React.FC<{}> = ({}) =>  {

    const navigate = useNavigate();

    return (
        <div>
              <div className="flex justify-center items-center h-full px-4 py-36">
                <div className="max-w-2xl text-center w-screen">
                <h1 className="text-2xl font-bold text-yellow-500 mb-4 drop-shadow-lg">
                    Bem-vindo ao</h1>
                <img
                  alt="Your Company"
                  src={logo}
                  className="mx-auto h-200 w-200 drop-shadow-lg"
                />
                  <button
                      type="submit"
                      className="justify-center rounded-md bg-yellow-700 px-3 py-1 text-sm/6 font-semibold text-white shadow-xs hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => navigate('/usuario')}
                    >
                      Cadastre-se
                    </button> 
                    <p className="mt-4 text-center text-sm/6 text-white">
                        Já tem uma conta?{' '}
                        <a href="/login" className="font-semibold text-yellow-700 hover:text-yellow-500">
                            Entre aqui
                        </a>
                    </p>
                </div>
              </div>
            </div>
    );
}

export default Landing;