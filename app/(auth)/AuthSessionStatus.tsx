const AuthSessionStatus = ({ status, className, ...props }: { status: string | any, className: string | any, [key: string]: any }) => (
  <>
    {status && (
      <div
        className={`${className} font-medium text-sm text-green-600`}
        {...props}>
        {status}
      </div>
    )}
  </>
)

export default AuthSessionStatus;