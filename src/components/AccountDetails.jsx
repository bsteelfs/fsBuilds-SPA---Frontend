import { Button, Checkbox, Form, Input, Typography } from "antd"
import { WarningTwoTone } from "@ant-design/icons"
import { useState } from "react"
import { useAuth } from "../store/AuthContext"
import BasicAxios from "../lib/axios"
import AccountManagementButton from "./AccountManagementButton"

const { Text } = Typography

export default function AccountDetails() {
  const { fastspringAccount, user } = useAuth()
  const contact = fastspringAccount?.contact

  const [form] = Form.useForm()
  const [componentDisabled, setComponentDisabled] = useState(true)

  const updateFastSpringAccount = (values) => {
    BasicAxios.post("/fastspring/account/update/" + user.fs_account_id, values)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div className="w-[60%] flex items-start justify-start flex-col pt-[40px]">
      <Text keyboard className="text-[24px]">
        Billing Details
      </Text>

      <div className="mt-[20px] pl-[20px]">
        <Text strong>FastSpring ID: </Text>
        <Text mark>{user?.fs_account_id ? user.fs_account_id : "No ID"}</Text>
      </div>

      {!contact && (
        //For testing when there is no user
        <div className="mb-[20px] pl-[20px]">
          <AccountManagementButton />
        </div>
      )}
      {contact ? (
        <div className="p-[20px] w-[100%]">
          <div className="mb-[20px]">
            <AccountManagementButton />
          </div>
          <Checkbox
            className="mb-[10px]"
            checked={componentDisabled}
            onChange={(e) => setComponentDisabled(e.target.checked)}
          >
            Inputs Disabled
          </Checkbox>
          <Form
            className="max-w-[600px] p-[20px] rounded-[5px] shadow-lg bg-[#fff] text-[16px]"
            form={form}
            onFinish={updateFastSpringAccount}
            initialValues={{
              first: contact?.first,
              last: contact?.last,
              email: contact?.email,
              company: contact?.company,
              phone: contact?.phone,
            }}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            disabled={componentDisabled}
          >
            {fields().map((field) => {
              return (
                <Form.Item
                  key={field.name}
                  label={field.placeholder}
                  name={field.name}
                  rules={[
                    {
                      required: field.required,
                      message: `Please input your ${field.name}!`,
                    },
                    {
                      type: field.type,
                      message: `Please input a valid ${field.name}!`,
                    },
                  ]}
                >
                  <Input
                    style={{
                      color: componentDisabled ? "var(--color-gray)" : "black",
                    }}
                  />
                </Form.Item>
              )
            })}
            <Button
              disabled={componentDisabled}
              type="primary"
              htmlType="submit"
              style={{ marginLeft: "100px" }}
            >
              Submit
            </Button>
          </Form>
        </div>
      ) : (
        <div className="shadow-lg bg-[#fff] rounded-[5px] p-[20px] w-[100%] flex items-center justify-start gap-[10px]">
          <WarningTwoTone
            style={{
              fontSize: "24px",
            }}
          />
          <p>
            No account details found. You need to have an active subscription to
            view and edit your account details.
          </p>
        </div>
      )}
    </div>
  )
}

const fields = () => {
  return [
    {
      name: "first",
      type: "text",
      required: true,
      placeholder: "First Name",
    },
    {
      name: "last",
      type: "text",
      required: true,
      placeholder: "Last Name",
    },
    {
      name: "email",
      type: "email",
      required: true,
      placeholder: "Email",
    },
    {
      name: "company",
      type: "text",
      required: false,
      placeholder: "Company",
    },
    {
      name: "phone",
      type: "tel",
      required: false,
      placeholder: "Phone",
    },
  ]
}
