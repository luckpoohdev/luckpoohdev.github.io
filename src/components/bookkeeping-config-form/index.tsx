// react
import { useMemo } from 'react'
// hook form
import { useWatch } from 'react-hook-form'
// @mui
import {
  Grid,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Stack,
  AvatarGroup,
  Avatar,
} from '@mui/material';
// ----------------------------------------------------------------------

import img from 'src/utils/img';
import CollapsibleCard from 'src/components/collapsible-card';
import { RHFAutocomplete, RHFCountrySelect, RHFSwitch, RHFRadioGroup } from 'src/components/hook-form';
import CountryFlag from 'src/components/country-flag';

import getCardLogoUrl from '@/utils/getCardLogoUrl';
  
  const OssTaxCountries = ({ accountOptions, vatAccountOptions, departmentOptions }) => {
      const ossTaxCountries = useWatch({ name: 'selected_oss_tax_countries' }) ?? []
      const taxCountries = useMemo(() => {
        return ossTaxCountries.sort().map((ossTaxCountryCode, key) => {
          const prefix = `oss_tax_countries.${ossTaxCountryCode}.`
          return (
            <Grid item xs={12} key={key}>
              <CollapsibleCard defaultCollapsed={true} unmountOnExit={false}>
                <CardHeader title={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CountryFlag code={ossTaxCountryCode} />
                    <Typography variant="subtitle1">Kontoplan for salg til {ossTaxCountryCode}</Typography>
                  </Stack>
                } />
                <CardContent>
                  <Grid container rowSpacing={3} columnSpacing={2} sx={{ pt: 1 }}>
                    <Grid item xs={12} md={4}><RHFAutocomplete name={`${prefix}department`} label="Afdeling" options={departmentOptions} /></Grid>
                    <Grid item xs={12} md={4}><RHFAutocomplete name={`${prefix}vat_code_sales`} label="Momskode for salg med moms" required options={vatAccountOptions} /></Grid>
                    <Grid item xs={12} md={4}><RHFAutocomplete name={`${prefix}no_vat_code_sales`} label="Momskode for salg uden moms" required options={vatAccountOptions} /></Grid>
                    <Grid item xs={12} md={6}><Typography variant="subtitle1">Kontoplan for salg</Typography></Grid>
                    <Grid item xs={12} md={6}><Typography variant="subtitle1">Kontoplan for refunderinger</Typography></Grid>
                    <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}vat_product_sale_account`} label="Salg af varer med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                    <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}vat_product_refund_account`} label="Refundering af varer med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                    <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}no_vat_product_sale_account`} label="Salg af varer uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                    <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}no_vat_product_sale_refund`} label="Refundering af varer uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                    <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}vat_service_sale_account`} label="Salg af ydelser med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                    <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}vat_service_refund_account`} label="Refundering af ydelser med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                    <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}no_vat_service_sale_account`} label="Salg af ydelser uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                    <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}no_vat_service_refund_account`} label="Refundering af ydelser uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                    <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}vat_shipping_sale_account`} label="Salg af fragt med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                    <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}vat_shipping_refund_account`} label="Refundering af fragt med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                    <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}no_vat_shipping_sale_account`} label="Salg af fragt uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                    <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}no_vat_shipping_refund_account`} label="Refundering af fragt uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                    <Grid item xs={12} md={12}>
                        <Button type="submit" variant="contained" fullWidth>Gem indstillinger</Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </CollapsibleCard>
            </Grid>
          )
        })
      }, [ ossTaxCountries ]);
      return (
        <>
          <Grid item xs={12} sx={{ mx: 3, mt: 3 }}>
            <Typography variant="subtitle1">Opsæt specifik kontoplan for særskilte lande (OSS Moms)</Typography>
            <RHFCountrySelect
              name="selected_oss_tax_countries"
              label="Valgte lande"
              placeholder="Tilføj land..."
              multiple
              sx={{ mt: 3 }}
            />
          </Grid>
          {taxCountries}
        </>
      )
    }

const BookkeepingConfigForm = ({
    accountOptions,
    journalOptions,
    vatAccountOptions,
    departmentOptions,
    acquiringProviders,
  }) => {
    const isAutomaticBookkeepingActive = !!useWatch({ name: 'automatic_bookkeeping' });
    if (!isAutomaticBookkeepingActive) return null;
    return (
  <>
    <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 1.75 }}>
      <Grid item xs={12} sx={{ height: '75vh' }}>
        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
          <Grid item xs={12}>
            <CollapsibleCard sx={{ mt: 3 }} defaultCollapsed={true} unmountOnExit={false}>
              <CardHeader title={
                <Typography variant="h4">Håndtering af salg, refunderinger, betalinger og udbetalinger</Typography>
              } />
              <CardContent>
                <Grid container rowSpacing={3} columnSpacing={2}>
                  <Grid item xs={12}>
                    <CollapsibleCard defaultCollapsed={true} unmountOnExit={false}>
                      <CardHeader title={
                        <Typography variant="subtitle1">Generelt</Typography>
                      } />
                      <CardContent>
                        <Grid container rowSpacing={3} columnSpacing={2}>
                          <Grid item xs={12}>
                            <Stack>
                              <RHFSwitch name="bookkeep_business_sales_as_b2b" label="Bogfør salg med firmanavn, CVR og EAN som B2B-salg" />
                              <RHFSwitch name="accounting_year_follows_calendar_year" label="Virksomhedens regnskabsår følger kalenderåret (01/01 - 31/12)" />
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={6}><RHFCountrySelect name="base_country_code" label="Momspligtigt land" required /></Grid>
                          <Grid item xs={12} md={6}><RHFCountrySelect name="default_country_code" label="Ved mangel på landekode i leveringsadresse bruges" /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="journal" label="Kassekladde til bogføring af posteringer" options={journalOptions} required/></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="sales_department" label="Afdelingskode til salg" options={departmentOptions} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="general_balancing_account" label="Fordelingskonto til betalinger" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="general_round_off_account" label="Konto til afrundingsdifference" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="general_currency_exchange_loss_account" label="Konto til valutakurstab" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="general_currency_exchange_win_account" label="Konto til valutakursgevinst" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={12}>
                            <Button type="submit" variant="contained" fullWidth>Gem indstillinger</Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CollapsibleCard>
                  </Grid>
                  <Grid item xs={12}>
                    <CollapsibleCard defaultCollapsed={true} unmountOnExit={false}>
                      <CardHeader title={
                        <Typography variant="subtitle1">Kontoplan for indland og EU</Typography>
                      } />
                      <CardContent>
                        <Grid container rowSpacing={3} columnSpacing={2} sx={{ pt: 1 }}>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2c.vat_code_sales" label="Momskode for salg med moms" required options={vatAccountOptions} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2c.no_vat_code_sales" label="Momskode for salg uden moms" required options={vatAccountOptions} /></Grid>
                          <Grid item xs={12} md={6}><Typography variant="subtitle1">Kontoplan for salg</Typography></Grid>
                          <Grid item xs={12} md={6}><Typography variant="subtitle1">Kontoplan for refunderinger</Typography></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2c.vat_product_sale_account" label="Salg af varer med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2c.vat_product_refund_account" label="Refundering af varer med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2c.no_vat_product_sale_account" label="Salg af varer uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2c.no_vat_product_sale_refund" label="Refundering af varer uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2c.vat_service_sale_account" label="Salg af ydelser med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2c.vat_service_refund_account" label="Refundering af ydelser med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2c.no_vat_service_sale_account" label="Salg af ydelser uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2c.no_vat_service_refund_account" label="Refundering af ydelser uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2c.vat_shipping_sale_account" label="Salg af fragt med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2c.vat_shipping_refund_account" label="Refundering af fragt med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2c.no_vat_shipping_sale_account" label="Salg af fragt uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2c.no_vat_shipping_refund_account" label="Refundering af fragt uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={12}>
                              <Button type="submit" variant="contained" fullWidth>Gem indstillinger</Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CollapsibleCard>
                  </Grid>
                  <Grid item xs={12}>
                    <CollapsibleCard defaultCollapsed={true} unmountOnExit={false}>
                      <CardHeader title={
                        <Typography variant="subtitle1">Kontoplan for B2B-salg i EU</Typography>
                      } />
                      <CardContent>
                        <Grid container rowSpacing={3} columnSpacing={2} sx={{ pt: 1 }}>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2b.vat_code_sales" label="Momskode for salg med moms" required options={vatAccountOptions} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2b.no_vat_code_sales" label="Momskode for salg uden moms" required options={vatAccountOptions} /></Grid>
                          <Grid item xs={12} md={6}><Typography variant="subtitle1">Kontoplan for salg</Typography></Grid>
                          <Grid item xs={12} md={6}><Typography variant="subtitle1">Kontoplan for refunderinger</Typography></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2b.vat_product_sale_account" label="Salg af varer med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2b.vat_product_refund_account" label="Refundering af varer med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2b.no_vat_product_sale_account" label="Salg af varer uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2b.no_vat_product_sale_refund" label="Refundering af varer uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2b.vat_service_sale_account" label="Salg af ydelser med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2b.vat_service_refund_account" label="Refundering af ydelser med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2b.no_vat_service_sale_account" label="Salg af ydelser uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2b.no_vat_service_refund_account" label="Refundering af ydelser uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2b.vat_shipping_sale_account" label="Salg af fragt med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2b.vat_shipping_refund_account" label="Refundering af fragt med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2b.no_vat_shipping_sale_account" label="Salg af fragt uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="b2b.no_vat_shipping_refund_account" label="Refundering af fragt uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={12}>
                              <Button type="submit" variant="contained" fullWidth>Gem indstillinger</Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CollapsibleCard>
                  </Grid>
                  <Grid item xs={12}>
                    <CollapsibleCard defaultCollapsed={true} unmountOnExit={false}>
                      <CardHeader title={
                        <Typography variant="subtitle1">Kontoplan for øvrige dele af verdenen (NON-EU)</Typography>
                      } />
                      <CardContent>
                        <Grid container rowSpacing={3} columnSpacing={2} sx={{ pt: 1 }}>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="non_eu.vat_code_sales" label="Momskode for salg med moms" required options={vatAccountOptions} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="non_eu.no_vat_code_sales" label="Momskode for salg uden moms" required options={vatAccountOptions} /></Grid>
                          <Grid item xs={12} md={6}><Typography variant="subtitle1">Kontoplan for salg</Typography></Grid>
                          <Grid item xs={12} md={6}><Typography variant="subtitle1">Kontoplan for refunderinger</Typography></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="non_eu.vat_product_sale_account" label="Salg af varer med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="non_eu.vat_product_refund_account" label="Refundering af varer med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="non_eu.no_vat_product_sale_account" label="Salg af varer uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="non_eu.no_vat_product_sale_refund" label="Refundering af varer uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="non_eu.vat_service_sale_account" label="Salg af ydelser med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="non_eu.vat_service_refund_account" label="Refundering af ydelser med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="non_eu.no_vat_service_sale_account" label="Salg af ydelser uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="non_eu.no_vat_service_refund_account" label="Refundering af ydelser uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="non_eu.vat_shipping_sale_account" label="Salg af fragt med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="non_eu.vat_shipping_refund_account" label="Refundering af fragt med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="non_eu.no_vat_shipping_sale_account" label="Salg af fragt uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={6}><RHFAutocomplete name="non_eu.no_vat_shipping_refund_account" label="Refundering af fragt uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                          <Grid item xs={12} md={12}>
                              <Button type="submit" variant="contained" fullWidth>Gem indstillinger</Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CollapsibleCard>
                  </Grid>
                  <OssTaxCountries accountOptions={accountOptions} vatAccountOptions={vatAccountOptions} departmentOptions={departmentOptions} />
                </Grid>
              </CardContent>
            </CollapsibleCard>
          </Grid>
          <Grid item xs={12}>
            <CollapsibleCard defaultCollapsed={true} unmountOnExit={false}>
                <CardHeader title={
                  <Typography variant="h4">Håndtering af udbetalinger via indløser</Typography>
                } />
                <CardContent>
                  <Grid container rowSpacing={3} columnSpacing={2} sx={{ pt: 1 }}>
                    {acquiringProviders.map((acquiringProvider) => (
                      <Grid item xs={12}>
                        <CollapsibleCard defaultCollapsed={true} unmountOnExit={false}>
                          <CardHeader title={
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar sx={{ backgroundColor: 'background.paper', '& .MuiAvatar-img': { objectFit: 'contain', width: '80%', height: '80%' } }} src={img(acquiringProvider.logo_url)} />
                              <Typography variant="subtitle1">{acquiringProvider.name}</Typography>
                            </Stack>
                          } />
                          <CardContent>
                            <Grid container rowSpacing={3} columnSpacing={2} sx={{ pt: 1 }}>
                              <Grid item xs={12}>
                                <AvatarGroup>
                                  {['mastercard', 'visa', 'amex', 'dankort', 'cb', 'jcb', 'ec', 'amex'].map((cardType) => (
                                    <Avatar sx={{ backgroundColor: 'background.paper', '& .MuiAvatar-img': { objectFit: 'contain', width: '80%', height: '80%' } }} src={getCardLogoUrl(cardType)} />
                                  ))}
                                </AvatarGroup>
                              </Grid>
                              <Grid item xs={12}>
                                <RHFRadioGroup
                                  name="payout_type"
                                  options={[
                                    { value: 'bundle', label: 'Udbetaling i bundter' },
                                    { value: 'single', label: 'Enkeltvise udbetalinger' },
                                  ]}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}><RHFAutocomplete name={`payout_account[${acquiringProvider.slug}]`} label="Bankkonto penge udbetales på" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                              <Grid item xs={12} md={6}><RHFAutocomplete name={`card_fee_account[${acquiringProvider.slug}]`} label="Konto til bogføring af kortgebyrer" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                              <Grid item xs={12} md={6}><RHFAutocomplete name={`receivables_account[${acquiringProvider.slug}]`} label="Konto til tilgodehavender fra indløser" required options={accountOptions} groupBy={(option) => option.groupBy}/></Grid>
                              <Grid item xs={12} md={6}><RHFAutocomplete name={`economic_card_fee_journal[${acquiringProvider.slug}]`} label="E-conomic kassekladde til bogføring af kortgebyrer" options={journalOptions} /></Grid>
                              <Grid item xs={12} md={12}>
                                <Button type="submit" variant="contained" fullWidth>Gem indstillinger</Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </CollapsibleCard>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
            </CollapsibleCard>
          </Grid>
        </Grid>
  
            </Grid>
          </Grid>
  </>
    );
  }
  export default BookkeepingConfigForm;