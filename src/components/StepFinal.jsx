import { whiteLabeled } from "@/utils/sampleData";
import { usePathname } from "next/navigation";
import Translate from "./Translate";
import { stagingData } from "@/utils/data";
import "../styles/step1.css";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";
import { Menu, MenuItem, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { toast } from "react-toastify";
import "../styles/theme.css";
import axios from "axios";
import { setUser } from "@/Redux/slices/authSlice";
import { useRouter } from "next/navigation";

const StepFinal = ({
	roomRef,
	architectureRef,
	setStep,
	selectedImage,
	customFunction,
	completedRef,
	completeFunction,
	checkResult,
	isDemo
}) => {
	const pathname = usePathname();
	const dispatch = useDispatch();
	const router = useRouter();
	const filterStyle = 'brightness(0) saturate(100%) invert(55%) sepia(97%) saturate(1383%) hue-rotate(174deg) brightness(85%) contrast(90%)';
	const [selectedPairs, setSelectedPairs] = useState([]);
	const [previewImg, setPreviewImg] = useState(
		Array.isArray(selectedImage) ? selectedImage[0] : selectedImage
	);
	const [showModal, setShowModal] = useState(false);
	const [roomType, setRoomType] = useState(stagingData['living room'].image);

	const [roomName, setRoomName] = useState('living room');
	const [furnishingStyle, setFurnishingStyle] = useState('modern');
	const [furnishingImg, setFurnishingImg] = useState('/architecture/living_room/modern.jpg');
	const [numberImgs, setNumberImgs] = useState(1);
	const [isComplete, setCompleted] = useState(false);
	const [score, setScore] = useState([]);
	const { user } = useSelector((state) => state.auth.user);
	const [finalImages, SetFinalImages] = useState([]);
	const ApiKey = "HLOH64Q4-20230313-OOQV9VVR";
	const [themeColor, setThemeColor] = useState('');
	const [showProgressModal, setShowProgressModal] = useState(false);
	const [creditsPerMonth, setCreditsPerMonth] = useState(0);

	const saveResultImages = (newImages) => {
		SetFinalImages((prevImages) => [
			...prevImages,
			newImages,
		]);
	}


	useEffect(() => {
		console.log('state user', user);
		// setCreditsPerMonth(user.creditsPerMonth);
		const currentUrl = window.location.href;
		switch (true) {
			case currentUrl.includes('ilist'):
				setThemeColor('bg-ilist')
				break;
			case currentUrl.includes('exp'):
				setThemeColor('bg-exp')
				break;
			case currentUrl.includes('viking'):
				setThemeColor('bg-viking')
				break;
			case currentUrl.includes('kwcp'):
				setThemeColor('bg-kwcp')
				break;
			case currentUrl.includes('cb'):
				setThemeColor('bg-cb')
				break;
			case currentUrl.includes('c21'):
				setThemeColor('bg-c21')
				break;
			case currentUrl.includes('realsmart'):
				setThemeColor('bg-realsmart')
				break;
			case currentUrl.includes('realty'):
				setThemeColor('bg-realty')
				break;
			default:
				setThemeColor('bg-Color')
				console.warn('No matching provider found.');
		}

		const detectDisable = () => {
			const rows = checkResult.length;
			const columns = 5;
			const matrix = Array.from({ length: rows }, () => Array(columns).fill(1));

			checkResult.forEach((element, index) => {
				if (element.result?.sceneType === 'Indoor') {
					matrix[index][2] = 0;	// disable grass repair in case of indoor
					matrix[index][1] = 0; // sky replacement
					if (element.result?.isEmpty === false) {
						matrix[index][3] = 0;
					} else if (element.result?.isEmpty === true) {
						matrix[index][4] = 0;
					}
				} else if (element.result?.sceneType === 'Outdoor') {
					matrix[index][3] = 0;
					matrix[index][4] = 0;
				}
			});
			setScore(matrix);
		}

		detectDisable();
		setShowProgressModal(false);
		setShowModal(false);
	}, []);

	useEffect(() => {
		if (completedRef.current === numberImgs) {
			setCompleted(true);
			completedRef.current = 0;
			completeFunction(finalImages, selectedPairs);
			setShowProgressModal(false);
		}
	}, [completedRef.current])

	const [progress, setProgress] = useState(0);
	let stepIncrement = 0.2;
	const stepDuration = 100;
	switch (numberImgs) {
		case 1:
			stepIncrement = 0.4;
			break;
		case 2:
			stepIncrement = 0.4;
			break;
		case 3:
			stepIncrement = 0.3;
			break;
		case 4:
			stepIncrement = 0.2;
			break;
		case 5:
			stepIncrement = 0.1;
			break;
		case 6:
			stepIncrement = 0.1;
			break;
	}

	useEffect(() => {
		if (!showProgressModal) return;

		const interval = setInterval(() => {
			setProgress((prevProgress) => {
				const targetValue = (100 * (completedRef.current + 1)) / numberImgs;
				if (prevProgress < targetValue) {
					return Math.min(prevProgress + stepIncrement, targetValue);
				} else {
					clearInterval(interval);
					return prevProgress;
				}
			});
		}, stepDuration);

		return () => clearInterval(interval);
	}, [completedRef.current, showProgressModal]);

	const [roomData, setRoomData] = useState({
		isTraining: false,
		image: "/room_type/living_room.webp",
		architecture_style: [
			{
				style: "modern",
				image: "/architecture/living_room/modern.jpg",
			},
			{
				style: "coastal",
				image: "/architecture/living_room/coastal.jpg",
			},
			{
				style: "contemporary",
				image: "/architecture/living_room/contemporary.jpg",
			},
			{
				style: "wooden",
				image: "/architecture/living_room/wooden.jpg",
			},
			// {
			// 	style: "rustic",
			// 	image: "/architecture/bathroom/rustic.jpg",
			// },
			{
				style: "scandinavian",
				image: "/architecture/bedroom/scandinavian.jpg",
			},
		],
	});

	const handleSelect = (imageIndex, boxIndex) => {
		setSelectedPairs(prevPairs => {
			const newPair = [imageIndex, boxIndex];
			const pairIndex = prevPairs.findIndex(
				(pair) => pair[0] === imageIndex && pair[1] === boxIndex
			);

			if (pairIndex !== -1) {
				const newPairs = [...prevPairs];
				newPairs.splice(pairIndex, 1);
				return newPairs;
			} else {
				return [...prevPairs, newPair];
			}
		});
	};

	const reset = () => {
		setSelectedPairs([]);
	}

	const processImg = () => {
		console.log('crm user detail', user)
		if (selectedPairs.length === 0) {
			toast.error("Please select a model to convert");
			return;
		}

		if (!user) {
			toast.error("You are not registered user.");
			return;
		}
		if (selectedPairs.length > user.creditsPerMonth) {
			toast.error("Please purchase credits to continue.");
			router.push("/plans");
			return;
		}

		setNumberImgs(selectedPairs.length);
		const temNum = selectedPairs.filter(pair => pair[1] === 3 || pair[1] === 4);
		const hasStagingOrFurnishing = temNum.length > 0 ? true : false;
		if (hasStagingOrFurnishing) {
			setShowModal(true);
		} else {
			onConfirm();
		}
	}

	const handleClose = () => {
		setShowModal(false)
	}

	const [anchorEl, setAnchorEl] = useState(null);
	const [roomStyle, setRoomStyle] = useState(null);

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const menuClose = () => {
		setAnchorEl(null);
	};
	const handleStyleMenuClick = (event) => {
		setRoomStyle(event.currentTarget);
	};

	const styleMenuClose = () => {
		setRoomStyle(null);
	};

	const selectRoom = (each) => {
		setRoomType(each);
		setFurnishingStyle('modern');
		architectureRef.current = furnishingStyle
		menuClose();
	}
	const setName = (selectedName) => {
		roomRef.current = selectedName;
		setRoomName(selectedName);
		setRoomData(stagingData[selectedName]);
		const room = stagingData[selectedName];
		setFurnishingImg(room.architecture_style[0].image);
	}

	const selectRoomStyle = (roomName) => {
		setFurnishingStyle(roomName);
		architectureRef.current = roomName;
	}

	const selectFurnishingImg = (roomImg) => {
		setFurnishingImg(roomImg);
		styleMenuClose();
	}

	const handleProgressModalClose = () => {
		setShowProgressModal(false);
	}

	const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
		height: 40,
		borderRadius: 20,
		[`&.${linearProgressClasses.colorPrimary}`]: {
			backgroundColor: theme.palette.grey[200],
			...theme.applyStyles('dark', {
				backgroundColor: theme.palette.grey[800],
			}),
		},
		[`& .${linearProgressClasses.bar}`]: {
			borderRadius: 0,
			backgroundColor: '#1a90ff',
			...theme.applyStyles('dark', {
				backgroundColor: '#308fe8',
			}),
		},
	}));

	const onConfirm = async () => {
		roomRef.current = roomName;
		architectureRef.current = furnishingStyle;
		setShowModal(false);
		setShowProgressModal(true);
		let formData = {};
		for (let i = 0; i < selectedPairs.length; i++) {
			const imageIndex = selectedPairs[i][0];
			formData = isDemo ? getFormData(selectedImage, selectedPairs[i][1]) : getFormData(selectedImage[imageIndex], selectedPairs[i][1]);
			try {
				switch (selectedPairs[i][1]) {
					case 3:
						await stagingAPI(formData);
						break;
					case 4:
						await refurnishingAPI(formData);
						break;
					default:
						await enhanceAPI(formData);
						break;
				}
			} catch (error) {
				console.error(`Error occurred on pair ${i}:`, error);
				alert(`Error occurred on pair ${i}:`, error);
				continue;
			}
		}
		consumeCredits(selectedPairs.length);
	}

	const consumeCredits = async (consumedCredits) => {
		let currentUrl = window.location.href;
		let tempUrl = currentUrl.includes('ilist') ? 'https://backend.proptexx.com/api' : 'https://backend-rep.proptexx.com/api'
		const name = user.name;
		const email = user.email;
		try {
			const res = await axios.put(
				`${tempUrl}/payment/consumeCredits/${user._id}`,
				{ name, email, consumedCredits }
			);
			if (res?.data?.success) {
				const { credits, creditsPerMonth } = res.data.user;
				dispatch(
					setUser({
						user: {
							...user,
							credits,
							creditsPerMonth,
						},
					})
				);
			} else {
				toast.error(res.data.message);
			}
		} catch (error) {
			console.log(error, "error");
			if (error.response) toast.error(error.response.data.message);
		}
	}

	const getFormData = (image, modelIndex) => {
		let formData = {};
		switch (modelIndex) {
			case 0:
				formData = {
					image_url: image,
					modelName: 'photo enhancement'
				};
				break;
			case 1:
				formData = {
					image_url: image,
					modelName: 'sky replacement'
				};
				break;
			case 2:
				formData = {
					image_url: image,
					modelName: 'grass repair'
				};
				break;
			case 3:
				formData = {
					imageUrl: image,
					architecture_style: architectureRef.current,
					do_preprocess: true,
					room_type: roomRef.current,
				};
				break;
			case 4:
				formData = {
					image_url: image,
					architecture_style: architectureRef.current,
					do_preprocess: true,
					room_type: roomRef.current,
				};
				break;
		}
		return formData;
	}

	const enhanceAPI = async (formData) => {
		try {
			await fetch('https://backend.proptexx.com/api/models/photoenhancement',
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-api-key": ApiKey,
					},
					body: JSON.stringify(formData),
				}
			)
				.then((response) => response.json())
				.then((response) => {
					if (!response.message.result.imageUrl) {
						saveResultImages('');
						return;
					} else {
						saveResultImages(response.message.result.imageUrl);
					}
				})
		} catch (err) {
			const errorMessage = err?.response?.data?.message;
			if (errorMessage === "Token verification failed") {
				console.log(`Login Expire, Please login again`);
				dispatch(setUser({}));
			} else {
				toast.error(`An error occurred in ${formData.modelName} model`)
				saveResultImages('');
			}
		};
		completedRef.current++;
	}

	const stagingAPI = async (formData) => {
		try {
			const response = await fetch('https://backend.proptexx.com/api/models/virtualStaging',
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-api-key": ApiKey,
					},
					body: JSON.stringify(formData),
				}
			);

			const data = await response.json();
			if (!data.message.result.imageUrl) {
				console.log("Failed to generate final image");
			}
			saveResultImages(data.message.result.imageUrl);

		} catch (error) {
			toast.error('An error occurred in virtual staging model')
			saveResultImages('');
		}
		completedRef.current++;
	}

	const refurnishingAPI = async (formData) => {
		try {
			await fetch('https://backend.proptexx.com/api/models/virtualRefurnishing',
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-api-key": ApiKey,
					},
					body: JSON.stringify(formData),
				}
			)
				.then((response) => response.json())
				.then((data) => {
					saveResultImages(data.message.result.imageUrl);
				});
		} catch (err) {
			toast.error('An error occurred in virtual refurnishing model')
			saveResultImages('');
		};
		completedRef.current++;
	}

	return (
		<>
			{!isComplete && (
				<div className="w-full grid max-[1750px]:grid-cols-1 grid-cols-[3fr_2fr]  items-center justify-center">
					<div className="max-[1750px]:mb-10">
						<div className="min-[978px]:flex items-center justify-between md:!mt-3.5 m-auto preview-header max-[1750px]:w-4/5 min-[1750px]:w-[900px]">
							<div className="w-7/12 max-[978px]:w-full">
								<div className="enhancement-header flex items-center justify-start gap-2">
									<img className="ai-logo"
										src="/ai-logo.png"
										alt="AI logo"
									/>
									<div className="title">
										<Translate text="AI Photo Editing" />
									</div>
								</div>
								<div className="text-sm">
									<Translate text="Automatically adjust the sky, grass and brightness of your property photos, add or change the furniture. If you like the results you can export them to your property listing." />
								</div>
							</div>
							<div className="w-5/12 max-[978px]:w-full max-[978px]:my-4 max-[978px]:justify-start min-[800px]:flex justify-center items-center">
								{user && (
									<>
										<div className="max-[978px]:flex justify-center max-[978px]:justify-start items-center gap-5">
											<div className="flex justify-center items-center gap-5 min-[978px]:mb-2.5 max-[978px]:py-2">
												<div className="flex items-center max-[1750px]:justify-center gap-3">
													<span><Translate text="USED:" /> {user.credits}</span>
													<span><Translate text="REMAINING:" />  {user.creditsPerMonth}</span>
												</div>
												<div
													className={`${themeColor} flex items-center px-2.5 py-1.5 font-semibold text-sm max-[1750px]:text-center text-white rounded-lg cursor-pointer transition-transform duration-500 hover:scale-110`}
													onClick={() => {
														router.push("/plans")
													}}
												>
													<Translate text="Purchase credits" />&nbsp;&nbsp;
												</div>
											</div>
											<div className="credits-result flex min-[978px]:mb-2.5 max-[978px]:hidden">
												<div
													className={`flex items-center justify-start pl-3 ${themeColor}`}
													style={{
														borderRadius: '8px',
														width: `${user?.credits * 350 / (user?.creditsPerMonth + user?.credits)}px`,
														color: 'white',
													}}
												>
												</div>
											</div>
										</div>
										<ul className="flex flex-wrap flex-col items-start gap-2 my-5 min-[800px]:hidden">
											<li className="flex justify-center items-center gap-2">
												General Enhancement
												<img className="w-[20px] h-[20px]" src="/photo-enhancement.png" alt="Photo Enhancement" style={{ filter: filterStyle }} />
											</li>
											<li className="flex justify-center items-center gap-2">
												Sky Replacement
												<img className="w-[20px] h-[20px]" src="/sky-replacement.png" alt="Sky Replacement" style={{ filter: filterStyle }} />
											</li>
											<li className="flex justify-center items-center gap-2">
												Grass Repair
												<img className="w-[20px] h-[20px]" src="/grass-leaves-svgrepo-com.png" alt="Grass Leaves" style={{ filter: filterStyle }} />
											</li>
											<li className="flex justify-center items-center gap-2">
												Virtual Staging
												<img className="w-[20px] h-[20px]" src="/virtual.png" alt="Virtual Staging" style={{ filter: filterStyle }} />
											</li>
											<li className="flex justify-center items-center gap-2">
												Virtual Refurnishing
												<img className="w-[20px] h-[20px]" src="/virtual.png" alt="Virtual Refurnishing" style={{ filter: filterStyle }} />
											</li>
										</ul>
									</>
								)}
							</div>
						</div>

						<div className="flex flex-col-reverse gap-5 md:!grid md:!mt-3.5 max-[800px]:my-3">
							<div className="table-header gap-5 m-auto">
								<div className="py-0 min-[560px]:px-4 h-[122px] w-[120px] max-[1750px]:w-[150px] max-[1130px]:w-[105px] max-[800px]:w-[65px] max-[800px]:h-[70px] max-[560px]:h-[35px] max-[560px]:w-[35px] invisible"></div>
								<div className='py-0 min-[560px]:px-4 h-[122px] w-[120px] max-[1750px]:w-[150px] max-[1130px]:w-[105px] max-[800px]:w-[65px] max-[800px]:h-[70px] max-[560px]:h-[35px] max-[560px]:w-[35px] flex items-center justify-center rounded-2xl max-[560px]:rounded-xl' style={{ border: '2px solid #E7F1F9' }}>
									<div className="text-center">
										<div className="flex items-center justify-center min-[800px]:mb-2.5">
											<img className="w-[20px] h-[20px] max-[560px]:w-[13px] max-[560px]:h-[13px]" src="/photo-enhancement.png" alt="Grass Leaves" style={{ filter: filterStyle }} />
										</div>
										<div className='text-center max-[800px]:hidden'>
											<Translate text="General Enhancement" />
										</div>
									</div>
								</div>
								<div className='py-0 min-[560px]:px-4 h-[122px] w-[120px] max-[1750px]:w-[150px] max-[1130px]:w-[105px] max-[800px]:w-[65px] max-[800px]:h-[70px] max-[560px]:h-[35px] max-[560px]:w-[35px] flex items-center justify-center rounded-2xl max-[560px]:rounded-xl' style={{ border: '2px solid #E7F1F9' }}>
									<div className="text-center">
										<div className="flex items-center justify-center min-[800px]:mb-2.5">
											<img className="w-[20px] h-[20px] max-[560px]:w-[13px] max-[560px]:h-[13px]" src="/sky-replacement.png" alt="Grass Leaves" style={{ filter: filterStyle }} />
										</div>
										<div className='text-center max-[800px]:hidden'>
											<Translate text="Sky Replacement" />
										</div>
									</div>
								</div>
								<div className='py-0 min-[560px]:px-4 h-[122px] w-[120px] max-[1750px]:w-[150px] max-[1130px]:w-[105px] max-[800px]:w-[65px] max-[800px]:h-[70px] max-[560px]:h-[35px] max-[560px]:w-[35px] flex items-center justify-center rounded-2xl max-[560px]:rounded-xl relative' style={{ border: '2px solid #E7F1F9' }}>
									<div className="text-center">
										<div className="flex items-center justify-center min-[800px]:mb-2.5">
											<img className="w-[20px] h-[20px] max-[560px]:w-[13px] max-[560px]:h-[13px]" src="/grass-leaves-svgrepo-com.png" alt="Grass Leaves" style={{ filter: filterStyle }} />
										</div>
										<div className='text-center max-[800px]:hidden'>
											<Translate text="Grass Repair" />
										</div>
									</div>
								</div>
								<div className='py-0 min-[560px]:px-4 h-[122px] w-[120px] max-[1750px]:w-[150px] max-[1130px]:w-[105px] max-[800px]:w-[65px] max-[800px]:h-[70px] max-[560px]:h-[35px] max-[560px]:w-[35px] relative flex items-center justify-center rounded-2xl max-[560px]:rounded-xl' style={{ border: '2px solid #E7F1F9' }}>
									<div className="text-center">
										<div className="flex items-center justify-center min-[800px]:mb-2.5">
											<img className="w-[20px] h-[20px] max-[560px]:w-[13px] max-[560px]:h-[13px]" src="/virtual.png" alt="Grass Leaves" style={{ filter: filterStyle }} />
										</div>
										<div className='text-center max-[800px]:hidden'>
											<Translate text="Virtual Staging" />
										</div>
									</div>
									<img className="new-badge absolute max-[560px]:hidden" src="/new.png" alt="new" />
								</div>
								<div className='py-0 min-[560px]:px-4 h-[122px] w-[120px] max-[1750px]:w-[150px] max-[1130px]:w-[105px] max-[800px]:w-[65px] max-[800px]:h-[70px] max-[560px]:h-[35px] max-[560px]:w-[35px] flex items-center justify-center rounded-2xl max-[560px]:rounded-xl relative' style={{ border: '2px solid #E7F1F9' }}>
									<div className="text-center">
										<div className="flex items-center justify-center min-[800px]:mb-2.5">
											<img className="w-[20px] h-[20px] max-[560px]:w-[13px] max-[560px]:h-[13px]" src="/virtual.png" alt="Grass Leaves" style={{ filter: filterStyle }} />
										</div>
										<div className='text-center max-[800px]:hidden'>
											<Translate text="Virtual Refurnishing" />
										</div>
									</div>
									<img className="new-badge absolute max-[560px]:hidden" src="/new.png" alt="coming soon" />
								</div>
							</div>
						</div>
						{!isDemo ? (
							<>
								<div className="h-[430px] max-[1750px]:h-auto max-[1750px]:max-h-[430px] max-[1750px]:mb-20 overflow-y-auto">
									{selectedImage.map((image, imageIndex) => (
										<div key={imageIndex} className="pics-row flex items-center justify-center gap-5 !max-[1750px]:gap-10 md:!mt-5 max-[800px]:my-3">
											<div className={`selected-image h-[80px] w-[120px] max-[1130px]:w-[105px] max-[1750px]:w-[150px] max-[800px]:w-[65px] max-[800px]:h-[50px] max-[560px]:w-[35px] max-[560px]:h-[35px] ${previewImg === image ? 'active' : ''}`} onClick={() => {
												setPreviewImg(image);
											}}>
												<img src={image} alt="selected image"></img>
											</div>
											{[...Array(5)].map((_, boxIndex) => (
												<div
													key={boxIndex}
													className={`flex items-center justify-center h-[80px] w-[120px] max-[1750px]:w-[150px] max-[1130px]:w-[105px] max-[800px]:w-[65px] max-[800px]:h-[50px] max-[560px]:w-[35px] max-[560px]:h-[35px] 
														${score[imageIndex]?.[boxIndex] === 0 ? 'no-hover' : 'pics-box'}
														${selectedPairs.some(pair => pair[0] === imageIndex && pair[1] === boxIndex) ? 'hover' : ''}
													`}
													onClick={() => {
														if (score[imageIndex]?.[boxIndex] !== 0) {
															handleSelect(imageIndex, boxIndex);
														}
													}}
												>
													<img
														className={`${selectedPairs.some(pair => pair[0] === imageIndex && pair[1] === boxIndex) || score[imageIndex]?.[boxIndex] === 0 ? 'hover' : ''
															}`}
														src={score[imageIndex]?.[boxIndex] === 0 ? "/disabled.png" : "/selected.png"}
														alt="selected image"
													/>
												</div>
											))}
										</div>
									))}
								</div>


							</>
						) : (
							<>
								<div className="image-conversion overflow-y-auto">
									<div className="pics-row flex items-center justify-center gap-5 !max-[1750px]:gap-10 md:!mt-5 max-[800px]:my-3">
										<div className={`selected-image h-[80px] w-[120px] max-[1130px]:w-[105px] max-[1750px]:w-[150px] ${previewImg === selectedImage ? 'active' : ''}`} onClick={() => {
											setPreviewImg(selectedImage);
										}}>
											<img src={selectedImage} alt="selected image"></img>
										</div>
										{[...Array(5)].map((_, boxIndex) => (
											<div
												key={boxIndex}
												className={`flex items-center justify h-[80px]-center w-[120px] max-[1750px]:w-[150px] max-[1130px]:w-[105px] 
														${score[0]?.[boxIndex] === 0 ? 'no-hover' : 'pics-box'}
														${selectedPairs.some(pair => pair[0] === 0 && pair[1] === boxIndex) ? 'hover' : ''}
													`}
												onClick={() => {
													if (score[0]?.[boxIndex] !== 0) {
														handleSelect(0, boxIndex);
													}
												}}
											>
												<img
													className={`${selectedPairs.some(pair => pair[0] === 0 && pair[1] === boxIndex) || score[0]?.[boxIndex] === 0 ? 'hover' : ''
														}`}
													src={score[0]?.[boxIndex] === 0 ? "/disabled.png" : "/selected.png"}
													alt="selected image"
												/>
											</div>
										))}
									</div>
								</div>
							</>
						)}
					</div>
					<div className="">
						<div className="preview-img min-[1750px]:flex justify-center md:!mt-5 max-[1750px]:hidden">
							{!isDemo ? (
								<img
									className={`preview max-[1750px]:w-[990px] min-[1750px]:w-[660px] min-[1750px]:h-[439px] max-[1750px]:h-[638px] ${!previewImg ? 'invisible' : ''}`}
									src={previewImg}
									alt="AI logo"
								/>
							) : (
								<img
									className={`preview ${!selectedImage ? 'invisible' : ''}`}
									src={selectedImage}
									alt="Demo page"
								/>
							)}
						</div>
						{!isDemo ? (
							<div className="footer min-[1750px]:float-right !mt-[20px] max-[1750px]:m-auto flex items-center justify-center min-[1750px]:w-1/2 max-[1000px]:w-1/2 max-[660px]:w-full max-[1750px]:w-1/3 gap-10">
								<button
									onClick={reset}
									className={`confirmStyleBtn ${themeColor}`}
								>
									<Translate text="Reset" />
								</button>
								<button
									onClick={processImg}
									className={`confirmStyleBtn ${themeColor} py-2`}
								>
									<Translate text={`Process - ${selectedPairs.length} credits`} />
								</button>
							</div>
						) : (
							<div className="footer min-[1750px]:float-right !mt-[20px] max-[1750px]:m-auto flex items-center justify-center min-[1750px]:w-1/2 max-[1000px]:w-1/2 max-[660px]:w-full max-[1750px]:w-1/3 gap-10">
								<button
									onClick={processImg}
									className="confirmStyleBtn !bg-mainColor"
								>
									<Translate text={`Demo - Process`} />
								</button>
							</div>
						)}
					</div>
				</div>
			)}
			{/* select style modal */}
			<Modal
				open={showModal}
				onClose={handleClose}
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
			>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 1195,
						height: 638,
						bgcolor: 'background.paper',
						boxShadow: 24,
						borderRadius: 9,
						p: 4,
					}}
					className="flex items-center justify-center"
				>
					<div>
						<h2 className="modal-title" id="modal-title">
							<Translate text="Choose the type of room & style you prefer" />
						</h2>
						<p className="modal-description" id="modal-description">
							<span>
								<Translate text="For" />
							</span>&nbsp;
							<span className="font-bold">
								<Translate text="Virtual Refurnishing and Virutal Staging" />
							</span>&nbsp;
							<span>
								<Translate text="we need the following information" />
							</span>
						</p>
						<div className="modal-body mt-5 flex justify-between gap-10">
							<div className="w-1/2 h-40 flex justify-between items-center gap-5">
								<div className="w-32">
									<img className="w-full h-20 rounded-md"
										src={roomType}
										alt="AI logo"
									/>
								</div>
								<div className="dropdown-menu flex justify-between items-center px-6 bg-[#EDEDED] rounded-md cursor-pointer" onClick={handleMenuClick}>
									<p className="text-base font-bold uppercase">
										<Translate text={roomName} />
									</p>
									<ArrowDropDownIcon />
								</div>
								<Menu
									className="simple-menu"
									open={Boolean(anchorEl)}
									anchorEl={anchorEl}
									onClose={menuClose}
									MenuListProps={{
										'aria-labelledby': 'basic-button',
									}}
								>
									<MenuItem className="menu-item relative transform transition-transform duration-300 ease-in-out hover:scale-x-105 hover:shadow-lg" onClick={() => { selectRoom(stagingData['living room'].image); setName('living room') }}>
										<img className="w-full h-full object-cover object-center"
											src={stagingData['living room'].image}
											alt="selected living room"
										/>
										<span className="absolute text-base text-white bottom-2.5 left-7 tracking-wide uppercase">
											<Translate text="Living Room" />
										</span>

									</MenuItem>
									<MenuItem className="menu-item relative transform transition-transform duration-300 ease-in-out hover:scale-x-105 hover:shadow-lg" onClick={() => { selectRoom(stagingData['bedroom'].image); setName('bedroom') }}>
										<img className="w-full h-full object-cover object-center"
											src={stagingData['bedroom'].image}
											alt="selected bedroom"
										/>
										<span className="absolute text-base text-white bottom-2.5 left-7 tracking-wide uppercase">
											<Translate text="Bedroom" />
										</span>
									</MenuItem>
								</Menu>
							</div>

							<div className="w-1/2 h-40 flex justify-between items-center gap-5">
								<div className="w-32">
									<img className="w-full h-20 rounded-md"
										src={furnishingImg}
										alt="AI logo"
									/>
								</div>
								<div className="dropdown-menu flex justify-between items-center px-6 bg-[#EDEDED] rounded-md cursor-pointer" onClick={handleStyleMenuClick}>
									<p className="text-base font-bold uppercase">
										<Translate text={furnishingStyle} />
									</p>
									<ArrowDropDownIcon />
								</div>
								<Menu
									className="simple-menu"
									open={Boolean(roomStyle)}
									anchorEl={roomStyle}
									onClose={styleMenuClose}
									MenuListProps={{
										'aria-labelledby': 'basic-button',
									}}
								>
									{
										roomData.architecture_style.map((each, index) => (
											<MenuItem key={index} className="menu-item relative transform transition-transform duration-300 ease-in-out hover:scale-x-105 hover:shadow-lg" onClick={() => { selectRoomStyle(each.style); selectFurnishingImg(each.image) }}>
												<img className="w-full h-full object-cover object-center"
													src={each.image}
													alt={each.style}
												/>
												<span className="absolute text-base text-white bottom-2.5 left-7 tracking-wide uppercase">
													<Translate text={each.style} />
												</span>
											</MenuItem>
										))
									}
								</Menu>
							</div>
						</div>
						<button
							className={`confirmStyleBtn ${themeColor}`}
							onClick={onConfirm}
						>
							<Translate text="Confirm" />
						</button>
					</div>
				</Box>
			</Modal >

			{/* show progress modal */}

			<Modal
				open={showProgressModal && !isComplete}
				onClose={(event, reason) => {
					if (reason !== "backdropClick") {
						handleProgressModalClose(); // Only close the modal for reasons other than clicking outside
					}
				}}
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
				disableEscapeKeyDown // This will prevent the modal from closing when pressing the Esc key
			>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '65%',
						height: '70%',
						bgcolor: 'background.paper',
						boxShadow: 24,
						borderRadius: 9,
						p: 4,
					}}
					className="preview-modal text-5xl max-[1700px]:text-4xl max-[1335px]:text-3xl !max-[1335px]:h-[50%] max-[1167px]:text-2xl"
				>
					<div className="modal-header flex items-center">
						<div className="flex items-center justify-between gap-5 px-24 max-[1700px]:px-12 max-[650px]:px-2">
							<img src="/sparkling-result.png" alt="Enhancement in process" />
							<p className="text-3xl text-white font-bold max-[650px]:text-xl">
								<Translate text="Enhancement in Process..." />
							</p>
						</div>
					</div>

					<div className="py-20 px-28 max-[1700px]:py-10 max-[1700px]:px-10 flex items-center justify-center">
						<div className="description w-3/5 max-[1335px]:w-full">
							<p className="text-2xl">
								<Translate text="Did you know ?" />
							</p>
							<p className="buyer font-bold mt-4">
								<Translate text="87% of home buyers relied on photos to help make their decision" />
							</p>
							<div className="progress">
								<div className="flex items-center justify-end gap-5 mt-10">
									<span className="text-4xl font-extrabold">{completedRef.current}/{numberImgs}</span>
									<span className="text-lg">
										<Translate text="photos completed" />
									</span>
								</div>
								<div>
									<BorderLinearProgress variant="determinate" value={progress} />
								</div>
							</div>
						</div>
						<div className="house w-2/5 flex justify-end items-center max-[1335px]:hidden">
							<img src="/house.png" alt="In process" />
						</div>
					</div>
				</Box>
			</Modal >
		</>
	);
};
export default StepFinal;
