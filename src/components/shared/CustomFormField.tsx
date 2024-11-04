import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  Input,
} from '@/components/ui'
import { CustomFormFieldProps } from '@/types'

const CustomFormField = ({
  control,
  name,
  label,
  placeholder,
  type = 'text',
}: CustomFormFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <FormLabel className="text-sm w-full max-w-[280px] font-medium text-light-secondary">
            {label}
          </FormLabel>
          <div className="flex flex-col gap-2 w-full">
            <FormControl>
              <Input
                id={`${name}-form-item`}
                type={type}
                placeholder={placeholder}
                className="text-base placeholder:text-sm rounded-lg border border-light-muted text-light-primary placeholder:text-light-muted px-4 py-6"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs text-red-600" />
          </div>
        </div>
      )}
    />
  )
}

export default CustomFormField
