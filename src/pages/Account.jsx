import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons"
import { Button, Divider, Popconfirm, Tag, Typography } from "antd"
import { useState } from "react"
import { fsEmebeddedComponentUrl } from "../consts"
import { fadeSkeletonAway, scriptLoader } from "../helpers"
import { useAuth } from "../store/AuthContext"
import { useFastSpring } from "../store/FastSpringContext"
import AccountDetails from "../components/AccountDetails"
import PaymentComponentContainer from "../components/PaymentComponentContainer"
import BasicAxios from "../lib/axios"
const { Text } = Typography

export default function Account() {
  const { products, productsFetched } = useFastSpring()
  const { mainSubscription, secondarySubscription, fastspringAccount, user } =
    useAuth()

  const mainProduct = products.find((product) => product.priceTotalValue > 50)
  const secondaryProduct = products.find(
    (product) => product.priceTotalValue <= 50
  )

  const [scriptRendered, setScriptRendered] = useState(false)
  const [oneClickPayButtonHovered, setOneClickPayButtonHovered] =
    useState(false)

  const [isMainSubPaused, setIsMainSubPaused] = useState(
    mainSubscription?.isPauseScheduled
  )
  const [isSecondarySubPaused, setIsSecondarySubPaused] = useState(
    secondarySubscription?.isPauseScheduled
  )

  const renderPaymentScript = () => {
    if (productsFetched) {
      setScriptRendered(true)
      const attributes = [
        {
          name: "data-access-key",
          value: import.meta.env.VITE_FS_ACCESS_KEY,
        },
      ]

      // Load the FastSpring script
      const script = scriptLoader(
        fsEmebeddedComponentUrl,
        oneClickPayButtonHovered ? attributes : null
      )

      script.onload = () => {
        window.fastspring.builder.reset()
        // Add the main product to the payment session
        if (!oneClickPayButtonHovered) {
          const mySession = {
            paymentContact: {
              email: user?.email ?? "",
              firstName: user?.name ?? "",
              lastName: user?.surname ?? "",
            },
          }

          window.fastspring.builder.push(mySession)
          window.fastspring.builder.add(mainProduct.path, 1)
        } else {
          // Add the secondary product to the session and build one-click payment component
          window.fastspring.builder.secure({
            account: fastspringAccount.id,
            items: [
              {
                product: secondaryProduct.path,
                quantity: 1,
              },
            ],
          })
        }

        // Hide payment component skeleton and show the real component
        fadeSkeletonAway()
      }

      document.body.appendChild(script)
    }
  }

  const pauseSubscription = (subscriptionId) => {
    BasicAxios.post("/fastspring/subscription/pause/" + subscriptionId)
      .then(() => {
        if (subscriptionId === mainSubscription.id) setIsMainSubPaused(true)
        else setIsSecondarySubPaused(true)
      })
      .catch(() => { })
  }

  const resumeSubscription = (subscriptionId) => {
    BasicAxios.post("/fastspring/subscription/resume/" + subscriptionId)
      .then(() => {
        if (subscriptionId === mainSubscription.id) setIsMainSubPaused(false)
        else setIsSecondarySubPaused(false)
      })
      .catch(() => { })
  }

  return (
    <div className="bg-[var(--color-elephant-white)] min-h-[100vh] w-[100vw]">
      <div className="p-[50px]">
        <Text underline className="text-[22px]">
          Manage your SaaSCo Subscription
        </Text>

        <div className="pt-[40px] gap-[50px]">
          <Text keyboard className="text-[24px]">
            Your Subscriptions
          </Text>
          <div className="text-[14px] p-[20px] pl-[20px] flex items-start justify-start gap-[20px]">
            {mainSubscription && (
              <div className={subscriptionItemStyles}>
                {tags([
                  mainSubscription?.priceDisplay,
                  mainSubscription?.intervalUnit + "ly",
                ])}
                <p>{mainSubscription?.display}</p>
                {subscriptionStatus(
                  isMainSubPaused,
                  <Popconfirm
                    title={popconfirmTitle(
                      isMainSubPaused,
                      mainSubscription.display
                    )}
                    description={popconfirmDescription(isMainSubPaused)}
                    onConfirm={() => {
                      if (!isMainSubPaused) {
                        pauseSubscription(mainSubscription.id)
                      } else {
                        resumeSubscription(mainSubscription.id)
                      }
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    {pauseOrResumeIcon(isMainSubPaused)}
                  </Popconfirm>
                )}
              </div>
            )}
            {secondarySubscription && (
              <div className={subscriptionItemStyles}>
                {tags([
                  secondarySubscription?.priceDisplay,
                  secondarySubscription?.intervalUnit + "ly",
                ])}
                <p>{secondarySubscription?.display}</p>
                {subscriptionStatus(
                  isSecondarySubPaused,
                  <Popconfirm
                    title={popconfirmTitle(
                      isSecondarySubPaused,
                      secondarySubscription.display
                    )}
                    description={popconfirmDescription(isSecondarySubPaused)}
                    onConfirm={() => {
                      if (!isSecondarySubPaused) {
                        pauseSubscription(secondarySubscription.id)
                      } else {
                        resumeSubscription(secondarySubscription.id)
                      }
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    {pauseOrResumeIcon(isSecondarySubPaused)}
                  </Popconfirm>
                )}
              </div>
            )}
            {!mainSubscription && (
              <div className={subscriptionItemStyles}>
                {tags([
                  mainProduct?.total,
                  mainProduct?.future.intervalUnit + "ly",
                ])}
                <p>Not subscribed currently!</p>
                <p>Do you want to add {'"' + mainProduct?.display + '"'}?</p>

                <Button
                  className="mt-[12px] text-[16px] flex items-center justify-center p-[10px]"
                  type="primary"
                  onClick={renderPaymentScript}
                >
                  <span>Subscribe</span>
                </Button>
              </div>
            )}
            {!secondarySubscription && mainSubscription && (
              <div className={subscriptionItemStyles}>
                {tags([
                  secondaryProduct?.total,
                  secondaryProduct?.future.intervalUnit + "ly",
                ])}
                <p>
                  Do you want to add {'"' + secondaryProduct?.display + '"'}?
                </p>

                <Button
                  className="mt-[12px] text-[16px] flex items-center justify-center p-[10px]"
                  type="primary"
                  onMouseEnter={() => {
                    setOneClickPayButtonHovered(true)
                  }}
                  onMouseLeave={() => {
                    setOneClickPayButtonHovered(false)
                  }}
                  onClick={renderPaymentScript}
                >
                  <span>Subscribe</span>
                </Button>
              </div>
            )}
          </div>

          <PaymentComponentContainer scriptRendered={scriptRendered} />
        </div>
        <Divider
          style={{
            minWidth: "75%",
            width: "75%",
          }}
        ></Divider>

        <AccountDetails />
      </div>
    </div>
  )
}

const popconfirmTitle = (isPaused, text) =>
  `${isPaused ? "Continue" : "Pause"} ${text} Subscription?`

const popconfirmDescription = (isPaused) =>
  `Are you sure you want to ${isPaused ? "Continue" : "Pause"} your subscription?`

const pauseOrResumeIcon = (isPaused) => {
  const styles = "text-[27px] cursor-pointer text-[#555]"

  return isPaused ? (
    <PlayCircleOutlined className={styles} />
  ) : (
    <PauseCircleOutlined className={styles} />
  )
}

const subscriptionStatus = (isPaused, pauseOrResumePopup) => {
  return (
    <div className="text-[18px] flex items-center justify-between mt-[12px]">
      <span>
        {isPaused ? (
          <Tag
            color="red"
            style={{
              fontSize: "16px",
              padding: "5px",
            }}
          >
            Paused
          </Tag>
        ) : (
          <Tag
            color="green"
            style={{
              fontSize: "16px",
              padding: "5px",
            }}
          >
            Active
          </Tag>
        )}
      </span>
      <span>{pauseOrResumePopup}</span>
    </div>
  )
}

const tags = (tagsArray) => {
  return (
    <div className="mb-[10px] flex items-start justify-start">
      {tagsArray.map((tag) => {
        return (
          <Tag
            style={{
              fontSize: "14px",
            }}
            key={tag}
          >
            {tag}
          </Tag>
        )
      })}
    </div>
  )
}

const subscriptionItemStyles =
  "mt-[20px] p-[20px] rounded-[4px] w-[30%] h-[160px] shadow-lg bg-[#fff] text-[16px]"
