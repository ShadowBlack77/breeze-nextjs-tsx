const Label = ({ className, children, ...props }: { className: string | any, children: any }) => (
  <label
      className={`${className} block font-medium text-sm text-gray-700`}
      {...props}>
      {children}
  </label>
)

export default Label
