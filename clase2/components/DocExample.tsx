import React from 'react';
import { ClipLoader } from "react-spinners";

const DocExample = ({
    children,
    titulo,
    loading,
}: {
    children: React.ReactNode;
    titulo: string
    loading?: boolean
}) => {

    if (loading) {
        return (
            <ClipLoader
                color="red"
                loading={loading}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        )
    }

    return (
        <div className='border:1'>
            Contenido de docs {titulo}
            {children}
        </div>
    )
}

export default DocExample;