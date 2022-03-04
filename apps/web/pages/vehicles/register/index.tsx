import { Spacer, Text } from '@nextui-org/react'
import axios from 'axios'
import useCompany from 'companies/hooks/useCompany'
import { fetcher } from 'core/http/fetcher'
import { Employees, EmployeeType } from 'employees/models'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import useSWR from 'swr'
import DashboardLayout from 'ui/layouts/DashboardLayout'
import withAuthAndi18n from 'utils/withAuthAndi18n'
import VehicleForm from 'vehicles/components/VehicleForm'

export const getServerSideProps = withAuthAndi18n

const RegisterVehicle = () => {
  const [company, loadingCompany, companyError] = useCompany()
  const router = useRouter()
  const intl = useIntl()

  const {
    data: employees,
    error: employeeError,
    isValidating: employeeIsValidating,
  } = useSWR<Employees>(
    company !== null
      ? `/api/employees/companies/${company.id}/employees`
      : null,
    fetcher,
  )

  const {
    data: drivers,
    error: driversError,
    isValidating: driversIsValidating,
  } = useSWR<Employees>(
    company !== null
      ? `/api/employees/companies/${company.id}/employees/by-type/${EmployeeType.Driver}`
      : null,
    fetcher,
  )

  useEffect(() => {
    if (companyError) {
      router.push('/companies/register')
    }
  }, [router, companyError])

  const handleSubmit = async values => {
    await axios.post(`/api/vehicles/companies/${company.id}/vehicles`, values)
  }

  return (
    <>
      <NextHead>
        <title>
          {intl.formatMessage({
            defaultMessage: 'Register vehicle',
          })}
        </title>
      </NextHead>

      {loadingCompany && <div>Loading company...</div>}
      {employeeIsValidating || (driversIsValidating && <div>Loading...</div>)}
      {employeeError ||
        driversError ||
        (companyError && <div>failed to load data</div>)}

      {company &&
        employees &&
        employees.length > 0 &&
        drivers &&
        drivers.length > 0 && (
          <>
            <Text h3>
              <FormattedMessage defaultMessage="Register vehicle" />
            </Text>

            <Spacer y={1} />

            <VehicleForm
              drivers={drivers || []}
              others={employees || []}
              onSubmit={handleSubmit}
            />
          </>
        )}
    </>
  )
}

RegisterVehicle.Layout = DashboardLayout

export default RegisterVehicle
