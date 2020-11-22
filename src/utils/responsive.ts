import Layout from '../constants/Layout';

export const NEXUS_5_HEIGHT = 592;
export const GALAXY_A5_HEIGHT = 640;

export const isSmallDevice = () => Layout.height < NEXUS_5_HEIGHT + 20;
