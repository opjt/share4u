export default function Skeleton({ children, data, className }) {

    return (
        <>
            {data ? (
                <>
                    {children}
                </>) : (
                <>
                    <div className={`skeleton ${className}`}></div>
                </>
            )}
        </>
    );
}
