import Layout from '../constants/Layout';

export const NEXUS_5_HEIGHT = 592;

export const isSmallDevice = () => Layout.height < NEXUS_5_HEIGHT + 10;
