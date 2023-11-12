"use client";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Dropzone from "react-dropzone";
import { cn } from "@/lib/utils";

const validationSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  products: z
    .array(
      z.object({
        file: z.any(),
        name: z.string().min(1, { message: "Product Name is required" }),
        description: z.string().min(1, {
          message: "Product Description is required",
        }),
        price: z.coerce.number(),
      })
    )
    .nonempty({ message: "Product is required" }),
});

type FormValues = z.infer<typeof validationSchema>;

export default function Home() {
  const form = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      products: [],
    },
  });

  const { fields, append } = useFieldArray({
    name: "products",
    control: form.control,
  });

  console.log(form.formState.errors);

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Form {...form}>
        <form
          action=""
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 max-w-md space-y-5"
        >
          <div className="relative name">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      type="text"
                      className="mt-3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 capitalize" />
                </FormItem>
              )}
            />
          </div>
          <div className="relative email">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      className="mt-3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 capitalize" />
                </FormItem>
              )}
            />
          </div>
          <div className="relative products_name_price_desc">
            {fields.map((_, index) => {
              return (
                <div key={index}>
                  <div className="mt-7 mb-2 text-xl font-bold">
                    {form.getValues(`products.${index}.file.name`)}
                  </div>
                  <div className="flex gap-x-3">
                    <FormField
                      control={form.control}
                      key={index}
                      name={`products.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 capitalize" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      key={index + 1}
                      name={`products.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Description</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 capitalize" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      key={index + 2}
                      name={`products.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Price</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 capitalize" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="relative products">
            <FormField
              control={form.control}
              name="products"
              render={() => (
                <Dropzone
                  accept={{
                    "image/*": [".jpg", ".jpeg", ".png"],
                  }}
                  onDropAccepted={(acceptedFiles) => {
                    acceptedFiles.map((acceptedFile) => {
                      return append({
                        file: acceptedFile,
                        name: "",
                        description: "",
                        price: 0,
                      });
                    });
                  }}
                  multiple={true}
                  maxSize={5000000}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps({
                        className: cn(
                          "p-3 mb-4 flex flex-col items-center justify-center w-full rounded-md cursor-pointer border border-[#e2e8f0]"
                        ),
                      })}
                    >
                      <div className="flex items-center gap-x-3 mt-2 mb-2">
                        <label
                          htmlFor="Products"
                          className={`text-sm text-[7E8DA0] cursor-pointer focus:outline-none focus:underline ${
                            form.formState.errors.products && "text-red-500"
                          }`}
                          tabIndex={0}
                        >
                          Add your Product Images
                          <input {...getInputProps()} />
                        </label>
                      </div>
                    </div>
                  )}
                </Dropzone>
              )}
            />
          </div>
          <Button type="submit" className="!mt-0 w-full">
            Add
          </Button>
        </form>
      </Form>
    </div>
  );
}
