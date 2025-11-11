import React from 'react';

interface HeaderProps {
    title: string;
    activeAthleteName?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, activeAthleteName }) => {
    return (
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            {activeAthleteName && (
                <p className="text-gray-400 mt-1">
                    Showing data for: <span className="font-semibold text-indigo-400">{activeAthleteName}</span>
                </p>
            )}
        </header>
    );
};
