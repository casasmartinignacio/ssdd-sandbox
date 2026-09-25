import React from 'react';

const DocsLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="flex flex-col space-between">
            <div className='flex flex-row bg-white'>
                <h1> Pagina de docs </h1>
            </div>
            <div className='flex flex-row border-1'>
                {children}
            </div>
        </div>
    )
}

export default DocsLayout;