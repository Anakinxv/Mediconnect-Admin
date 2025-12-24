import { type ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z, type ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form as MCForm } from "@/components/ui/form";
import { cn } from "@/lib/utils";
interface MCFormWrapperProps<TSchema extends ZodType<any, any, any>> {
  schema: TSchema;
  defaultValues?: z.input<TSchema>;
  onSubmit: (data: z.output<TSchema>) => void;
  children: ReactNode;
  className?: string;
}

function MCFormWrapper<TSchema extends ZodType<any, any, any>>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: MCFormWrapperProps<TSchema>) {
  const methods = useForm<z.input<TSchema>, any, z.output<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <MCForm {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={cn("", className)}
        >
          {children}
        </form>
      </MCForm>
    </FormProvider>
  );
}

export default MCFormWrapper;
