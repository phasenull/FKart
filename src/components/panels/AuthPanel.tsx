import React, { Fragment, useEffect, useState } from "react"
import { Avatar, Button, Card, HelperText, Text, TextInput, useTheme } from "react-native-paper"
import { Translated, validate } from "../../util"
import { useColorScheme } from "nativewind"
import { RegionChooser } from "../special/RegionChooser"
import User from "../../network/User"
import { FKart } from "../../network/FKart"

export default function Panel_Auth(props) {
	const [data, setData] = useState({
		email: "",
		password: "",
		confirm_password: "",
	})
	const { navigation } = props
	const { page_type } = props
	const [loading, set_loading] = useState(false)
	const [errors, set_errors] = useState({
		email: undefined,
		password: undefined,
		confirm_password: undefined,
	})
	const { move_to_page } = props
	const [response, set_response] = useState(null)
	useEffect(() => {
		const [email_success, email_error] = validate(data.email, User.is_input_phone(data.email) ? "phone" : "email")
		const [password_success, password_error] = validate(data.password, "password")
		const confirm_password_error =
			page_type == "Sign Up" && (data.password !== "" ? (data.password == data.confirm_password ? null : "Passwords do not match") : "")
		set_errors({ ...errors, email: email_error, password: password_error, confirm_password: confirm_password_error })
	}, [data])
	const [show_password, set_show_password] = useState(false)
	function check_fields() {
		return data.email && data.password && (page_type == "Log In" ? true : data.confirm_password)
	}
	function validate_fields() {
		if (!check_fields()) {
			console.log("check_fields", check_fields())
			return
		}
		const [email_success, email_error] = validate(data.email, User.is_input_phone(data.email) ? "phone" : "email")
		const [password_success, password_error] = validate(data.password, "password")
		const confirm_password_error =
			page_type == "Sign Up" && (data.password !== "" ? (data.password == data.confirm_password ? null : "Passwords do not match") : "")
		return email_success && password_success && (page_type == "Log In" ? true : confirm_password_error == null)
	}
	async function send_data() {
		if (await FKart.GetUser()) {
			navigation.replace("Home")
			return
		}
		if (!(await FKart.GET_DATA("region"))) {
			set_response("Please select a region")
			return
		}

		set_response(null)
		const empty_errors: { email?: string; password?: string; confirm_password?: string } = {}
		data.email || (empty_errors.email = "Please enter an email address")
		data.password || (empty_errors.password = "Please enter a password")
		data.confirm_password || (page_type == "Sign Up" && (empty_errors.confirm_password = "Please confirm your password"))
		set_errors({ ...errors, ...empty_errors })
		if (!validate_fields()) {
			return
		}
		set_loading(true)
		setTimeout(() => {
			set_loading(false)
		}, 1000)
		const user = await User.LogIn(data.email, data.password, await FKart.GET_DATA("region")).catch((error) => {
			console.log("error", error.toString())
			set_response(error.toString())
			return
		})
		if (user) {
			await FKart.SetUser(user)
			navigation.push("Home")
		}
	}
	return (
		<Fragment>
			{/* 
				SIGN UP FORM
			*/}
			<Card.Content>
				<TextInput
					className="mt-5"
					label={Translated("email")}
					value={data.email}
					inputMode="email"
					onChangeText={(text) => setData({ ...data, email: text })}
					error={errors.email && true}
				/>
				<HelperText className="ml-3" type="error" visible={errors.email && true}>
					{errors.email ? "- " + errors.email : null}
				</HelperText>
				<TextInput
					secureTextEntry={!show_password}
					label={Translated("password")}
					value={data.password}
					onChangeText={(text) => setData({ ...data, password: text })}
					right={
						<TextInput.Icon
							icon={show_password ? "eye-off" : "eye"}
							onPress={() => {
								set_show_password(!show_password)
							}}
						/>
					}
					error={errors.password && true}
				/>
				<HelperText className="ml-3" type="error" visible={errors.password && true}>
					{errors.password ? "- " + errors.password : null}
				</HelperText>

				{page_type == "Sign Up" && (
					<React.Fragment>
						<TextInput
							secureTextEntry={!show_password}
							label={Translated("confirm_password")}
							value={data.confirm_password}
							onChangeText={(text) => setData({ ...data, confirm_password: text })}
							right={
								<TextInput.Icon
									icon={show_password ? "eye-off" : "eye"}
									onPress={() => {
										set_show_password(!show_password)
									}}
								/>
							}
							error={errors.confirm_password && true}
						/>

						<HelperText className="ml-3" type="error" visible={errors.confirm_password && true}>
							{errors.confirm_password ? "- " + errors.confirm_password : null}
						</HelperText>
					</React.Fragment>
				)}
				<RegionChooser />
			</Card.Content>
			<Button
				className="mx-auto mt-5 justify-center"
				contentStyle={{
					height: 50,
					width: 150,
				}}
				loading={loading}
				disabled={loading}
				onPress={send_data}
				style={{
					borderRadius: 12,
				}}
				mode="contained"
			>
				{`${Translated(loading ? "loading" : page_type == "Log In" ? "login" : "signup")}`}
			</Button>
			{response ? (
				<HelperText className="ml-3" type="error">
					{response}
				</HelperText>
			) : null}
		</Fragment>
	)
}
