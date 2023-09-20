import React, { Fragment, useEffect, useState } from "react";
import { Avatar, Button, Card, HelperText, Text, TextInput, useTheme } from "react-native-paper";
import { Translated, validate } from "../../util";
import { useColorScheme } from "nativewind";
import { KentiminKarti } from "../../network/KentiminKarti";
import { useNavigation } from "@react-navigation/native";

export default function Panel_LogIn(props) {
	return <Text>Deprecated Component</Text>
	const {navigation} = props
	const [data, setData] = useState({
		email: "",
		password: ""
	});
	const [loading, set_loading] = useState(false);
	const [errors, set_errors] : any = useState({
	})
	useEffect(() => {
		const [email_success, email_error] = validate(data.email, "email");
		const [password_success, password_error] = validate(data.password, "password");
		set_errors({...errors,email: email_error, password: password_error})
	}, [data])
	const [show_password, set_show_password] = useState(false);
	async function send_data() {
		const empty_errors : {email?,password?} = {}
		data.email || (empty_errors.email = "Please enter an email address")
		data.password || (empty_errors.password = "Please enter a password")
		set_errors({...errors,...empty_errors})
		if (!validate_fields()) {return}
		set_loading(true);
		const App = KentiminKarti;
		const user = await App.Login(data.email, data.password).then((response)=>{
			set_loading(false);
			console.log("response",response)
			console.log("user",App.GetUser())
			if (response && App.GetUser()) {
				navigation.replace("Home")
			}
		}).catch((error) => {
			console.log("LogIn Error:",error);
			set_loading(false);
		});
	}
	function check_fields() {
		return data.email && data.password
	}
	function validate_fields() {
		if (!check_fields()) {return}
		const [email_success, email_error] = validate(data.email, "email");
		const [password_success, password_error] = validate(data.password, "password");
		return email_success && password_success
	}
	return (
		<Fragment>
			<Card.Content>
				<TextInput
					label= {`${Translated("email")}`}
					value={data.email}
					inputMode="email"
					onChangeText={text => setData({ ...data, email: text })}
					error={errors.email}
				/>
				<HelperText className="ml-3" type="error" visible={errors.email}>{errors.email ? "- " + errors.email : null}</HelperText>
				<TextInput
					className="mt-5"
					secureTextEntry={!show_password}
					label={`${Translated("password")}`}
					value={data.password}
					onChangeText={text => setData({ ...data, password: text })}
					right={
						<TextInput.Icon icon={show_password ? "eye-off" : "eye"} onPress={()=>{set_show_password(!show_password)}} />
					}
					error={errors.password}
				/>
				<HelperText className="ml-3" type="error" visible={errors.password}>{errors.password ? "- " + errors.password : null}</HelperText>
			</Card.Content>
			<Button className="mx-auto mt-5 justify-center" contentStyle={
				{
					height: 50,
					width: 150,
				}
			}
				loading={loading}
				disabled={loading}
				onPress={send_data}
				style={{
					borderRadius: 12,
				}}
				mode="contained">
				{`${Translated(loading ? "loading" : "login")}`}
			</Button>

		</Fragment>
	)
}